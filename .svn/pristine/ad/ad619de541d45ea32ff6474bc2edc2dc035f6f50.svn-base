#!/usr/bin/perl
#
# splits data table cut and pasted from http://opengeocode.org/download/countrynames.txt into:
#   <numeric code>,<2 char country code>,<ifirst (English) country name>
# sending to STDOUT.
#
# Probably only ever run it once, but...
#
# Ron C  2013-03-12
#

use strict;
use warnings;
use File::Basename;
use Getopt::Long;


my $PWD = `pwd`;
my $PROG = basename($0);
my $VERS = "1.0";

my $ipf;

MAIN:
{
  init();
  open (IN, "<$ipf") or die "Unable to open $ipf";
  
  while (my $line = <IN>) {
    if ($line =~ /(.+?)?;\s+.+?;\s*(\d+?);\s*(.+?);.*/) {
      print {*STDOUT} "$2,$1,$3\n";
    }
  }
  
  close IN;
}

#
# Parse command line args. Print Usage message if crook.
#
sub init
{
  print {*STDERR} "$PROG v$VERS\n";

  my $h;
  GetOptions("in=s"    => \$ipf,
             "help"    => \$h,
  );

  if ($h || (! defined $ipf)) {
    print {*STDERR} "Usage $PROG [options] --in=<file-path>≈\n" .
                 "Where file-path = Path to raw data file\n";
    exit 1;
  }

  unless (-f $ipf) {
    print {*STDERR} "$ipf file not found\n";
    exit 1;
  }
}

# EOF

