#!/usr/bin/perl
#
# Creates mysql loader files for tables pm_locations and pm_tmp from mined GS data file.
#
# Ron C.  2103-03-10
#         2013-03-23 Add test for empty lines/no GS data
#

use strict;
use warnings;
use File::Basename;
use Getopt::Long;


my $PWD = `pwd`;
my $PROG = basename($0);
my $VERS = "1.0";
my $ALL_LOCNS  = "all_locns~";
my $TROVE_REFS = "pm_tmp.txt";
my $GS_LOCNS   = "pm_tmp_loc.txt";

my $out;
my $ipf;
my $warn    = 0;
my $verbose = 0;

my $wcnt    = 0;
my $lncnt   = 0;
my $errcnt  = 0;

#
# Parses a line from the input file and writes it to the two output files, reformatted for the mysql loader
#
sub process_trove_ref ($$$)
{
  my ($data, $fht, $fhgs) = @_;
  print {*STDOUT} "Processing '$data'\n" if $verbose;
  my @info = split(m/\t/, $data);
  print {*STDERR} "Found " .scalar(@info) . " atoms\n" if $verbose;
  if (scalar(@info) <= 1) {
    if (scalar(@info) == 0) {
      return;
    }
    else {
      my $id = trim($info[0]);    
      _warn("Ignoring empty " . (scalar(@info) == 1 ? "trove ID " . $id : "line") . " at line $lncnt\n");
    }
  }
  else {
    my $troveId = trim($info[0]);
    unless ($troveId =~ /^\d+?$/) {
      _err("Invalid trove ID '" . $troveId . "' at line $lncnt\n");
      return;
    }
    
    print {*STDERR} "TROVE id $troveId\n" if $verbose;
    LOCN:
    for (my $idx = 1; $idx < scalar(@info); $idx++) {
      my @tmp = split(/,/, $info[$idx]);
      if ((scalar(@tmp) < 6) || (scalar(@tmp)) > 10) {
        _err("invalid param count (" . scalar(@tmp) . ") at line $lncnt:\n   $info[$idx]\n");
      }
      else {
        my $st1 = "$troveId";
        my $st2 = '';
        for (my $jdx = 0; $jdx < scalar(@tmp); $jdx++) {
          $tmp[$jdx] = trim($tmp[$jdx]);
          
          if (($jdx >= 2) && ($tmp[$jdx] =~ m/[^0-9-.]+/)) {
            _err("invalid lat/long for '$tmp[0]' at line $lncnt\n");
            next LOCN;
          }
          if (($jdx == 1) && ($tmp[$jdx] !~ m/\d{1,3}/)) {
            _warn("no state code for '$tmp[0]' at line $lncnt\n");
            $tmp[$jdx] = 'null';
          }
          if (($jdx == 2) && ($tmp[$jdx] !~ m/\d{1,3}/)) {
            _err("invalid country code for '$tmp[0]' at line $lncnt\n");
            next LOCN;
          }
          
          if ($jdx == 0) {
            $st1 .= "\t$tmp[$jdx]";
            $st2 .= "$tmp[$jdx]";
          }
          elsif ($jdx == 3) {
            $st1 .= "\t$tmp[$jdx]";
          }
          else {
            $st2 .= "\t$tmp[$jdx]";
            if ($jdx <= 2) {
              $st1 .= "\t$tmp[$jdx]";
            }
          }
        }
        print {$fht} "$st1\n";
        print {$fhgs} "$st2\n";
        print {*STDERR} "pm_tmp = $st1\n" if $verbose;
        print {*STDERR} "pm_loc = $st2\n" if $verbose;
      }
    }
  }
}

#
# remove leading/trailing white space
#
sub trim ($)
{
  my $str = shift;
  if (length($str) > 0) {
    $str =~ s/^\s*(.*?)\s*$/$1/;
  }
  return $str;
}

#
# Parse command line args. Print Usage message if crook.
#
sub init ()
{
  print {*STDERR} "$PROG v$VERS\n";

  my $h;
  GetOptions("in=s"    => \$ipf,
             "out=s"   => \$out,
             "warn"    => \$warn,
             "verbose" => \$verbose,
             "help"    => \$h,
  );

  if ($h || (! defined $ipf)) {
    print {*STDERR} "Usage $PROG [options] --in=<file-path>Å\n" .
                 "Where file-path = Path to raw data file\n" .
                 "  and Options are one or more of:\n" .
                 "  --out=<path>\n" .
                 "  --warn\n" .
                 "  --verbose\n" .
                 "  where path = destination for output files (default to in dir)\n" .
                 "        warn Displays warnings\n" .
                 "        verbose Displays progress and processing data\n";
    exit 1;
  }

  unless (-f $ipf) {
    err("$ipf file not found\n");
    exit 1;
  }
  
  if (! $out) {
    $out = dirname($ipf);
  }
  else {
    unless (-d $out) {
      err("$out not found\n");
      exit 1;
    }
  }
}

sub _warn ($)
{
  my $msg = shift;
  $wcnt++;
  print {*STDERR} "WARNING: $msg" if $warn;
}

sub _err ($)
{
  my $msg = shift;
  $errcnt++;
  print {*STDERR} "ERROR: $msg";
}

#
# Creates two files from the input.
# pm_tmp.txt is ready for the mysql loader
# The other (all_locns~) is sorted and filtered to remove duplicate locations
# producing pm_locations.txt for the loader.
MAIN:
{
  init();
  print {*STDERR} "Writing to $out\n" if $verbose;
  open (IN, "<$ipf") or die "Unable to open $ipf";
  open (FHT, ">$out/$TROVE_REFS") or die "Unable to open $out/$TROVE_REFS";
  open (FHGS, ">$out/$ALL_LOCNS") or die "Unable to open $out/$ALL_LOCNS";
  
  my $fht = \*FHT;
  my $fhgs = \*FHGS;
  my $line;
  
  while ($line = <IN>) {
    ++$lncnt;
    process_trove_ref($line, $fht, $fhgs);
  }
  
  close IN;
  close FHT;
  close FHGS;
  `sort $out/$ALL_LOCNS|uniq > $out/$GS_LOCNS`;
  print {*STDERR} "Complete " . ($errcnt == 0 ? 'ok' : '') . " $errcnt errors, $wcnt warnings. $lncnt lines processed.\n";
  exit ($errcnt);
}


# EOF
