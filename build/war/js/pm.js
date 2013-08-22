/*
 * Copyright (c) 2013 The University of Queensland. This software is being developed 
 * for the UQ School of History, Philosophy, Religion and Classics (HPRC).
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

// The webapp base URI is set by ANT build task
var PM_URI           = '/PaperMiner';

var TROVE_URL        = 'http://api.trove.nla.gov.au/';
var TROVE_QUERY_URL  = TROVE_URL + 'result?key=';
var GOOGLE_MAPS_URL  = 'http://maps.googleapis.com/maps/api/geocode/json?address=';

var ALERT            = 'Alert';
var INFO             = 'Information';
var QUESTION         = 'Question';
var UNDEF            = 'undefined';

var MAX_FETCH_SIZE   = 100;
var YEAR_OFFSET      = 44;
var YEAR_PX          = 4;

// names of user preference keys
var PMC_USER_ID      = 'id';
var PMC_TROVE_KEY    = 'key';
var PMC_USER_EMAIL   = 'em';
var PMC_USER_STATUS  = 'stat';

var MAIN_VIEW        = 'main-view';
var MAP_VIEW         = 'map-view';
var RAW_VIEW         = 'raw-view';
var CLOUD_VIEW       = 'cloud-view';
var HIST_VIEW        = 'histogram-view';
var MAP_CANVAS       = 'map-canvas';
var NEW_QUERY_PANE   = 'new-query-pane';
var CURR_QUERY_PANE  = 'current-query-pane';
var SAVE_QUERY_PANE  = 'save-query-pane';
var PARTNERS_PANE    = 'partners-pane';
var CONTACTS_PANE    = 'contact-pane';
var LOCN_EDIT_PANE   = 'locn-edit-pane';
var HELP_ABOUT       = 'help-about';
var HELP_TROVE       = 'help-trove';
var HELP_PM          = 'help-pm';
var HELP_RELEASE     = 'release-notes';
var TERMS_OF_USE     = 'help-tou';
var RAW_RECORD       = 'raw-record-container';
var Y2K_TIMELINE_BAR = 'y2k-timeline';
var Y2K_SLIDER       = 'y2k-slider';
var FOOTER_BAR       = 'footer-bar';
var Q_SIMPLE         = 'q-simple';
var Q_ADVANCED       = 'q-advanced';
var Q_CUSTOM         = 'q-custom';
var Q_SAVE           = 'save-query';
var Q_STORE          = 'stored-queries';
var Q_STORE_TABLE    = 'qstore-table';

// %age ranges and associated color for timeline and map pins
var FREQ_DISTR = [
    [0,0.5, '#ffffff'], [0.5,1, '#ccccff'], [1,1.5, '#6666ff'], 
    [1.5,2, '#0000ff'], [2,3,   '#00cccc'], [3,5,   '#009999'],
    [5,7,   '#006666'], [7,9,   '#ffff00'], [9,11,  '#ffcc00'],
    [11,13, '#ff9900'], [13,16, '#ff6600'], [16,20, '#ff0000'],
    [20,30, '#cc0000'], [30,45, '#660000'], [45,100,'#000000']             
 ];

// Schemas for TROVE zone structs have been intuited by inspection.  No docs exist!
// Currently (PM V1.0) only Newspaper is supported.
var ZONE_NEWSPAPER = {
    id:'newspaper', holder:'article', dtag:'date', rtag:'relevance.score', stag:'title.id',
    tags: [
    { tag:'id', title:'ID', isLink:false },
    { tag:'date', title:'Date', isLink:false },
    { tag:'title.value', title:'Source', isLink:false },
    { tag:'category', title:'Category', isLink:false },
    { tag:'heading', title:'Heading', isLink:false },
    { tag:'relevance.value', title:'Score', isLink:false },
    { tag:'relevance.score', title:'Revelance', isLink:false },
    { tag:'page', title:'Page', isLink:false },
    { tag:'snippet', title:'Snippet', isLink:false },
    { tag:'text', title:'Full Text', isLink:false },
    { tag:'troveUrl', title:'URL', isLink:true }
  ]};
var ZONE_ARTICLE = {
    id:'article', holder:'work', dtag:'issued', rtag:'relevance.score', stag:'',
    tags: [
    { tag:'id', title:'ID', isLink:false },
    { tag:'title', title:'Title', isLink:false },
    { tag:'issued', title:'Date Issued', isLink:false },
    { tag:'isPartOf', title:'Part of', isLink:false },
    { tag:'holdingsCount', title:'Holding', isLink:false },
    { tag:'versionCount', title:'Version', isLink:false },
    { tag:'relevance.value', title:'Score', isLink:false },
    { tag:'relevance.score', title:'Revelance', isLink:false },
    { tag:'type', title:'Type', isLink:false, mayRepeat:true },
    { tag:'troveUrl', title:'URL', isLink:true }
  ]};
var ZONE_BOOK = {
    id:'book', holder:'work', dtag:'issued', rtag:'relevance.score', stag:'',
    tags: [
    { tag:'id', title:'ID', isLink:false },
    { tag:'title', title:'Title', isLink:false },
    { tag:'type', title:'Type', isLink:false, mayRepeat:true },
    { tag:'issued', title:'Date Issued', isLink:false },
    { tag:'contributor', title:'Contributor(s)', isLink:false },
    { tag:'snippet', title:'Snippet', isLink:false },
    { tag:'versionCount', title:'Version', isLink:false },
    { tag:'relevance.value', title:'Score', isLink:false },
    { tag:'relevance.score', title:'Revelance', isLink:false },
    { tag:'troveUrl', title:'URL', isLink:true }
  ]};
var ZONE_PICTURE = { // FIXME: how to handle array of image links?
    id:'picture', holder:'work', dtag:'issued', rtag:'relevance.score', stag:'',
    tags: [
    { tag:'id', title:'ID', isLink:false },
    { tag:'title', title:'Title', isLink:false },
    { tag:'type', title:'Media Type', isLink:false, mayRepeat:true },
    { tag:'issued', title:'Date Issued', isLink:false },
    { tag:'snippet', title:'Snippet', isLink:false },
    { tag:'holdingsCount', title:'Holding', isLink:false },
    { tag:'versionCount', title:'Version', isLink:false },
    { tag:'relevance.value', title:'Score', isLink:false },
    { tag:'relevance.score', title:'Revelance', isLink:false },
    { tag:'troveUrl', title:'URL', isLink:true }
  ]};
var ZONE_MAP = {
    id:'map', holder:'work', dtag:'', rtag:'relevance.score', stag:'',
    tags: [
    { tag:'id', title:'ID', isLink:false },
    { tag:'title', title:'Title', isLink:false },
    { tag:'type', title:'Media Type', isLink:false, mayRepeat:true },
    { tag:'snippet', title:'Snippet', isLink:false },
    { tag:'holdingsCount', title:'Holding', isLink:false },
    { tag:'versionCount', title:'Version', isLink:false },
    { tag:'relevance.value', title:'Score', isLink:false },
    { tag:'relevance.score', title:'Revelance', isLink:false },
    { tag:'troveUrl', title:'URL', isLink:true }
  ]};
var ZONE_COLLECTION = {
    id:'collection', holder:'work', dtag:'issued', rtag:'relevance.score', stag:'',
    tags: [
    { tag:'id', title:'ID', isLink:false },
    { tag:'title', title:'Title', isLink:false },
    { tag:'type', title:'Media Type', isLink:false, mayRepeat:true },
    { tag:'issued', title:'Date Issued', isLink:false },
    { tag:'holdingsCount', title:'Holding', isLink:false },
    { tag:'versionCount', title:'Version', isLink:false },
    { tag:'relevance.value', title:'Score', isLink:false },
    { tag:'relevance.score', title:'Revelance', isLink:false },
    { tag:'troveUrl', title:'URL', isLink:true }
  ]};
var ZONE_LIST = {
    id:'list', holder:'list', dtag:'date', rtag:'relevance.score', stag:'',
    tags: [
    { tag:'id', title:'ID', isLink:false },
    { tag:'title', title:'Title', isLink:false },
    { tag:'creator', title:'Creator', isLink:false },
    { tag:'description', title:'Description', isLink:false },
    { tag:'listItemCount', title:'Items in list', isLink:false },
    { tag:'identifier.type', title:'Type', isLink:false },
    { tag:'identifier.value', title:'Link', isLink:true },
    { tag:'relevance.value', title:'Score', isLink:false },
    { tag:'relevance.score', title:'Revelance', isLink:false },
    { tag:'troveUrl', title:'URL', isLink:true }
  ]};
var ZONE_MUSIC = {
    id:'music', holder:'work', dtag:'issued', rtag:'relevance.score', stag:'',
    tags: [
    { tag:'id', title:'ID', isLink:false },
    { tag:'title', title:'Title', isLink:false },
    { tag:'contributor', title:'Contributor', isLink:false },
    { tag:'issued', title:'Date Issued', isLink:false },
    { tag:'type', title:'Media Type', isLink:false, mayRepeat:true },
    { tag:'snippet', title:'Snippet', isLink:false },
    { tag:'holdingsCount', title:'Holding', isLink:false },
    { tag:'relevence', title:'Relevence', isLink:false },
    { tag:'versionCount', title:'Version', isLink:false },
    { tag:'troveUrl', title:'URL', isLink:true }
  ]};

var MARKER_Z_BASE    =  26;
var PUBLISHER_MARKER =   0;
var LOCATION_MARKER  =   1;
var PAUSE_QUERY      =  -2;
var USER_VALIDATED   =   2;
var FADE_TD1         = 200;
var FADE_TD2         = 350;
var PREP_SAVE_QUERY  = 'prep';

// State variables
var m_run            = false;
var m_paused         = false;
var m_map            = null;
var m_pubCache       = null;
var m_locationsCache = null;
var m_qStore         = null;
var m_user           = null;
var m_locnSelections = null;
var m_queryId        =  0;
var m_rawRecordId    = -1;
var m_restrictRawList      = false;
var m_currentSaveFormPane  = Q_SAVE;
var m_currentQueryFormPane = Q_SIMPLE;
var m_currentPaneSelector  = _selById(MAP_VIEW);
var m_defaultViewSelector  = _selById(MAP_VIEW);

// FIXME: would be nice if this was an associative array
var m_totalRecs    = 0;
var m_fetchSize    = 8;
var m_locationsSum = 0;
var m_fetchStart   = 0;
var m_totalTime    = 0;
var m_trefIndex    = null;
var m_resultSet    = null;
var m_yearCount    = null;
var m_currentTerm  = null;
var m_currentZone  = null;
var m_currentQuery = null;
var m_locations    = null;


/**
 * Invoked by index page onload trigger, does any required configuration.
 */
function init ()
{
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.src = 'https://maps.googleapis.com/maps/api/js?sensor=false&reigon=AU&callback=_resetMap';
  document.body.appendChild(script);

  m_pubCache = new Array();
  m_locationsCache = new Array();

  $('button#map-zero').button();
  $('#radio-map').buttonset();
  _initSlider();
  _getUserPrefs();
  getMenu();
  
  // pre-load some panes but don't display
  newQuery(false);
  saveQuery(false);
  currentQuery(false);
  showRawResults(false);
  locnEdit(false);
}

/**
 * activated by map radio buttons hides/shows marker groups
 */
function toggleMapMarkers ()
{
  if (m_resultSet !== null) {
    var mtype = _getCheckedMapButton();
    if (mtype === PUBLISHER_MARKER) {
      for (var i = 0; i < m_resultSet.length; i++) {
        if (m_resultSet[i].marker !== null) {
          m_resultSet[i].marker.setVisible(_isInTimelineRange(i));     
        }
      }
      for (var locnId in m_locationsCache) {
        if (m_locationsCache[locnId].marker != null) {
          m_locationsCache[locnId].marker.setVisible(false);
        }
      }
    }
    else if (mtype === LOCATION_MARKER) {
      for (var i = 0; i < m_resultSet.length; i++) {
        if (m_resultSet[i].marker !== null) {
          m_resultSet[i].marker.setVisible(false);     
        }
      }
      for (var locnId in m_locationsCache) {
        if (m_locationsCache[locnId].marker != null) {
          m_locationsCache[locnId].marker.setVisible(_isRangeOverlap(m_locationsCache[locnId].yMin, m_locationsCache[locnId].yMax));
        }
      }
    }
  }
}

/**
 * Gets context adjusted menu html from server and inserts in document.
 */
function getMenu ()
{
  $.get(PM_URI + '/pm/men', function(data) { $('#menu-bar').html(data);  }, 'html')
      .error(function() { alert("ajax error fetching menu content"); });
}

/**
 * Logs out the user and resets the menu.
 * FIXME: should zonk last query state
 */
function doLogout ()
{
  $.get(PM_URI + '/pm/cls', function () {
    getMenu();
    m_user = null;
    m_qStore = null;
    _resetMap();
    _resetState();
    _showPane(m_defaultViewSelector);
  }).error(function() { alert("ajax error logging out"); });
}

/**
 * Manages user login/register pane.
 * @param cmd Pne of cancel, ret(urning), new, or open
 */
function doLogin (cmd)
{
  if (cmd == 'cancel') {
    $('#user-dlg').dialog('close');
  }
  else if (cmd == 'ret') {
    $('#trove-key').css({visibility:'hidden'});
    $('span#agree-opt').css({visibility:'hidden'});
    $('span#vfy-opt').css({visibility:'hidden'});
  }
  else if (cmd == 'new') {
    $('tr#trove-key').css({visibility:'visible'});
    $('span#agree-opt').css({visibility:'visible'});
    $('span#vfy-opt').css({visibility:'visible'});
  }
  else if (cmd == 'ok') {
    //var vfy = $('#usr-info input[name=usr-cb]:checked').val();
    var vfy =   $('#usr-info input[id=cb-vfy]:checked').val();
    var agree = $('#usr-info input[id=cb-agree]:checked').val();
    var sel =   $('#usr-selector input[name=usr-rb]:checked').val();
    var email = encodeURIComponent($('#em').val());
    var troveKey = encodeURIComponent($('#tk').val());
    var args = '?em=' + email + '&tk=' + troveKey + ((vfy == 'verify') ? '&vfy=y' : '');
    var option = (sel == 'new') ? 'add' : 'opn';
    if ((sel === 'new') && (agree !== 'agree')) {
      _popupDialog(ALERT, 'You must agree to the Terms of Use in order to complete registration.');
      return;
    }
    $.get(PM_URI + '/pm/' + option + args, function(data, option) { 
      if (data != 'ok') {
        _popupDialog(ALERT, data);
      }
      else {
        _getUserPrefs();
        $('#user-dlg').dialog('close');
        getMenu();
        _getStoredQueries();
        if (option == 'add') {
          _popupDialog(INFO, '<h3>Registration Complete</h3><p>Thankyou. You are now a registered Paper Miner user.');
        }
      }
    }, 'html').error(function() { alert("ajax error login"); });
  }
  else if (cmd == 'open') {
    if ($('#user-dlg').length > 0) {
      $('#user-dlg').dialog('open');
      $('#usr-info input')
       .not(':button, :submit, :reset, :hidden')
       .val('')
       .removeAttr('checked')
       .removeAttr('selected');
    }
    else {
        var dlgOpts = {
            title:'Login or Register', resizable:false, autoOpen:false, hide:FADE_TD1, show:FADE_TD1,
            modal: 'true', minWidth: 400,
            buttons: {'Cancel':function () { $(this).dialog("close"); }, "OK" : function () { doLogin('ok');  }},
            position: [200, 200] 
        };
      $.get(PM_URI + '/pm?pg=user_login', function(data) { 
        $('body').append(data);
        $('#user-dlg').dialog(dlgOpts);
        $('#user-dlg').dialog('open');
        $("#user-dlg").keydown(function (event) {
          if (event.keyCode == 13) {
            $(this).siblings('.ui-dialog-buttonpane').find("button:eq(1)").click();
          }
        });
      }, 'html').error(function() { alert("ajax error fetching menu fragment user_login"); });
    }
  }
}

/**
 * Manages pane allowing user to edit their settings and preferences.
 */
function doEditDetails ()
{
  $.get('/pm/mod', function(data) { 
    var opts = { autoOpen:'true', show:FADE_TD1, hide: FADE_TD1,
        position: [200, 200], 
        resizable: 'false', 
        buttons: {'Cancel':function () { $(this).dialog("destroy"); $('#user-mod').remove(); }, 'Update' : function () { 
          var vfy = $('#user-mod input[name=usr-cb]:checked').val();
          var args = '/pm/mod?id=' + $('#id').val() + '&em=' + $('#em').val() + '&tk=' + $('#tk').val() + ((vfy == 'verify') ? '&vfy=y' : '');
          $.get(PM_URI + args, function (data) { 
            if (data != 'ok') {
              _popupDialog(ALERT, data);
            }
            else {
              getMenu();
              _popupDialog(INFO, '<p>Your details have been updated.');
            }
          }, 'html').error(function() { alert("ajax error user update"); });

          $(this).dialog('destroy'); 
          $('#user-mod').remove(); 
        }},
        closeOnEscape:'false',
        open: function(event, ui) { $(this).parent().children().children(".ui-dialog-titlebar-close").hide(); }
      };
    $('body').append('<div id="user-mod" style="display:none" title="Manage User Preferences">' + data + '</div>');
    $('#user-mod').dialog(opts);
    }, 'html').error(function() { alert("ajax error maint"); });
}

/**
 * Reset query inputs to blank
 */
function resetQueryPane ()
{
  switch (m_currentQueryFormPane) {
  case Q_SIMPLE : 
    $('input#q1').val('');
    $('select#z1').val('newspaper');
    break;
  case Q_ADVANCED :
    // FIXME: todo
    break;
  case Q_CUSTOM :
    // FIXME: todo
    break;
  }
  _updateCurrQueryPane();
}


/**
 * Show the New Query pane unless a query is running
 * @param state
 */
function newQuery (show)
{
  if ($(_selById(NEW_QUERY_PANE)).length === 0) {
    var callback = function () {
      $('table#query-form button').button();
    };    
    _createPane(NEW_QUERY_PANE, callback, null);
  }
  
  if (show) {
    if (m_run) {
      _popupDialog(INFO, 'Please stop the current query before starting another.');
    }
    else {
      _showPane(_selById(NEW_QUERY_PANE));
    }
  }
}

/**
 * Display info about current/last query. State will update while query is runnig,
 * and permits the user to abort the query.
 */
function currentQuery (show)
{
  if ($(_selById(CURR_QUERY_PANE)).length === 0) {
    var callback = function () {
      $('table#curr-query-form button').button();
      _setCurrentQueryButtonState();
    };    
    _createPane(CURR_QUERY_PANE, callback, null);
  }
  
  if (show) {
    _showPane(_selById(CURR_QUERY_PANE));
    _updateCurrQueryPane();
  }
}

/**
 * Displays a list of the user's stored queries
 * @param show
 */
function showStoredQueries (show)
{
  if ($(_selById(SAVE_QUERY_PANE)).length === 0) {
    _createPane(SAVE_QUERY_PANE, null, null);
  }
  
  if (show) {
    _showPane(_selById(SAVE_QUERY_PANE));
    _showStoredQueryForm(Q_STORE);
  }
}

/**
 * Display the normally hidden option to save the current query
 * @param show
 * @param opt
 */
function saveQuery (show, opt)
{
  if ($(_selById(SAVE_QUERY_PANE)).length === 0) {
    var callback = function () {
      $('table#qstore-table button').button();
      _getStoredQueries();
    };    
    _createPane(SAVE_QUERY_PANE, callback, null);
  }

  if (!show) {
    return;
  }
  
  if (m_user.stat != USER_VALIDATED) {
    _popupDialog(ALERT, 'You must verify your email address before you can save queries.');
  }
  else if (m_currentQuery !== null ) {
    if (opt != null) {
      if (opt === 'can') {
        $(_selById(Q_SAVE)).toggle('fade', 'swing', FADE_TD2, function () {
          _showPane(_selById(CURR_QUERY_PANE)); 
        } );
      }
      else {
          $.get(PM_URI + '/pm/qsave?c=1', function (resp) { 
            if (resp == 'ok') {
              $('#qd1').val($('input#q1').val().replace(/[+]/g, ' '));
              _showPane(_selById(SAVE_QUERY_PANE));
              _showStoredQueryForm(Q_SAVE);
            }
            else {
              _popupDialog(ALERT, resp);
            }
          }, 'html').error(function() { alert("ajax error on query pre-save"); });
      }
    }
    else {
      var descr = encodeURIComponent($('#qd1').val());
      var query = encodeURIComponent(m_currentQuery);
      var qType = (m_currentQueryFormPane === Q_SIMPLE) ? 's' : 
                  (m_currentQueryFormPane === Q_ADVANCED) ? 'a' : 'c';
      if (descr.length === 0) {
        _popupDialog(ALERT, 'You must provide a description for your query.');
      }
      else {
        $.get(PM_URI + '/pm/qsave?d=' + descr + '&q=' + query + '&t=' + qType + '&n=' + m_totalRecs, function(data) { 
          if (data != 'ok') {
            _popupDialog(ALERT, data);
          }
          else {
            $(_selById(Q_SAVE)).toggle('fade', 'swing', FADE_TD2);
            _getStoredQueries();
            _popupDialog(INFO, 'Query saved');        
          }
        }, 'html').error(function() { alert("ajax error saving query"); });
      }
    }
  }
}

/**
 * Map initialized and displayed on startup
 * @param show
 */
function showMap (show)
{
  _showPane(_selById(MAP_VIEW));
}

function showHistogram (show)
{
  if ($(_selById(HIST_VIEW)).length === 0) {
    _createPane(HIST_VIEW, null, null);
  }
  _showPane(_selById(HIST_VIEW));
}

function showCloud (show)
{
  if ($(_selById(CLOUD_VIEW)).length === 0) {
    _createPane(CLOUD_VIEW, null, null);
  }
  _showPane(_selById(CLOUD_VIEW));
}

/**
 * Raw results pane loaded on demand.
 * @param show
 */
function showRawResults (show)
{
  if ($(_selById(RAW_VIEW)).length === 0) {
    var callback = function () {
      $('#ctl-table button').button();     
      $('#ctl-table button').button('disable');     
    };
    _createPane(RAW_VIEW, callback, null);
  }
  
  if (show) {
    _sortRaw(4);
    _showPane(_selById(RAW_VIEW));
  }
}

/**
 * Displays the various help dialogs and panes.
 * @param section
 */
function showHelp (section)
{
  if (section === 'about') {
    $.get(PM_URI + '/pm?pg=' + HELP_ABOUT, function(data) { 
      _popupDialog(INFO, data, 400);
      }, 'html').error(function() { alert("ajax error help"); });
  }
  else {
    var __loadHelp = function (pane) {
      if ($(_selById(pane)).length > 0) {
        _showPane(_selById(pane));
      }
      else {
        var cb1 = function () {
          _showPane(_selById(pane));
        };
        _createPane(pane, cb1, null);
      }
    };
    switch (section) {
    case 'pm':    __loadHelp(HELP_PM);      break;
    case 'rel':   __loadHelp(HELP_RELEASE); break;
    case 'tou':   __loadHelp(TERMS_OF_USE); break;
    case 'trove': __loadHelp(HELP_TROVE);   break;
    }
  }
}

function showPartners ()
{
  if ($(_selById(PARTNERS_PANE)).length === 0) {
    _createPane(PARTNERS_PANE, null, null);  
  }
  _showPane(_selById(PARTNERS_PANE));
}

function showContacts ()
{
  if ($(_selById(CONTACTS_PANE)).length === 0) {
    _createPane(CONTACTS_PANE, showContacts, null);  
  }
  _showPane(_selById(CONTACTS_PANE));
}

function goHome ()
{
  window.location = (PM_URI.length > 0) ? PM_URI : '/';
}


/**
 * Cross-browser code prevents an event propogating any further
 * @param evt
 */
function preventDefaultAction (evt)
{
  if (evt.preventDefault) {
    evt.preventDefault();
  }
  else {
    evt.returnValue = false;
  }

  if (evt.stopPropagation) {
    evt.stopPropagation();
  }
  else {
    evt.cancelBubble = true;
  }
};

/**
 * Convenience and reminder button opens TROVE on record in Raw display panel for editing in a new Tab.
 */
function fixRecord ()
{
  if (m_rawRecordId >= 0) {
    var link = document.getElementById('raw-trove-link');
    var e = document.createEvent('MouseEvents');
    e.initEvent( 'click', true, true );
    link.dispatchEvent(e); 
    $('button#rdv-pb2').button('enable');
  }
}

/**
 * Reloads the currently viewed record.  Intended for use after fixing the record in TROVE.
 */
function refreshRecord ()
{
  // FIXME: possible race condition problems here with async response
  if (m_rawRecordId >= 0) {
    var uri = TROVE_URL + m_currentZone + '/' + m_resultSet[m_rawRecordId].data.id + 
        '?key=' + m_user.key + 
        '&encoding=json' +
        '&include=articletext' + 
        '&callback=?';
    try {
      $.getJSON(uri, function (data, status, jqXHR) {
        if (status == "success") {
          var zoneInfo = _getZoneInfo(m_currentZone);
          var record = data[zoneInfo.holder];
          if (record) {
            if (typeof record.articleText === UNDEF) {
              m_resultSet[m_rawRecordId].data.text = '&lt;nil&gt;';
            }
            else {
              var text =  record.articleText.toString();
              text = text.replace(/<p>/g, '');
              text = text.replace(/<\/p>/g, '');
              m_resultSet[m_rawRecordId].data.text = text;
            }
            _displayRawDataItem(m_rawRecordId);
          }
        }
        $('input#pb-r2').attr('disabled','true');
      });
    }
    catch (err) {
      alert(err);
    }
  }
}

function locnEdit (show)
{
  if ($(_selById(LOCN_EDIT_PANE)).length === 0) {
    var callback = function () {
      $('div#location-ctl button').button();     
    };
    _createPane(LOCN_EDIT_PANE, callback, null);
  }
  
  if (show) {
    _showPane(_selById(LOCN_EDIT_PANE));
    _getFullTextForLocation(m_rawRecordId);
    _updateLocationsListDisplay(m_rawRecordId);
  }
}

function locnAdd ()
{
  m_locnSelections = new Array();
  var sel = null;
  var text = "";
  if (window.getSelection) {
    text = "" + window.getSelection();
  }
  else if ((sel = document.selection) && (sel.type == "Text")) {
    text = sel.createRange().text;
  }
  
  if ($('#add-locns-dlg').length > 0) {
    $('#add-locns-dlg').html(_formatAddLocations(text));
    _formatLocationSelections();
    $('#add-locns-dlg').dialog('open');
  }
  else {
    var dlgOpts = {
        title:'Add or Insert Location', resizable:false, autoOpen:false, hide:FADE_TD1, show:FADE_TD1,
        modal: 'true', minWidth: 500,  autoOpen:false,
        buttons: {'Cancel':function () { $(this).dialog("close"); }, 
                  'Search Locations' : function () { _findLocation(0); },
                  'Search Google Geocodes' : function () { _findLocation(1); } 
        },
        position: [200, 200] 
    };
    $('body').append(_formatAddLocations(text));
    $('#add-locns-dlg').dialog(dlgOpts);
    $('#add-locns-dlg').dialog('open');
  }
}

function returnToRaw ()
{
  _showPane(_selById(RAW_VIEW));
  _displayRawDataItem(m_rawRecordId);
}


// --------------------- Private Functions ------------------------

/**
 * Callback for Google maps API initialization
 */
function _resetMap () 
{
  var latlngCenter = new google.maps.LatLng(-27, 135);
  var pmOptions = {
    zoom: 4,
    mapTypeId: google.maps.MapTypeId.HYBRID, //ROADMAP
    streetViewControl: false
  };
  
  if (m_map == null) {
    m_map = new google.maps.Map(document.getElementById(MAP_CANVAS), pmOptions);
  }
  m_map.setCenter(latlngCenter);
  m_map.setOptions(pmOptions);
}

/**
 * Macro turns a name into a JQuery ID selector
 */
function _selById (id)
{
  return '#' + id;
}

/**
 * Get user's TROVE key and ID
 */
function _getUserPrefs ()
{
  $.getJSON(PM_URI + '/pm/info', function (data, status, jqXHR) {
    if (status == "success") {
      m_user = data;
    }
  });
}

/**
 * Fetches the user's stored queries from the server and displays them
 */
function _getStoredQueries ()
{
  $.getJSON(PM_URI + '/pm/qget', function (data, status, jqXHR) {
    if (status == "success") {
      m_qStore = data;
      _updateStoreQueriesPane();
    }
  });
}

/**
 * User has saved or deleted a query, so adjust the display accordingly.
 */
function _updateStoreQueriesPane ()
{
  if ($(_selById(Q_STORE)).length > 0) {
    $(_selById(Q_STORE_TABLE)).empty();
    if (m_qStore.length === 0) {
      $(_selById(Q_STORE_TABLE)).html('<tr><td>You have no Stored queries</td></tr>');
    }
    else {
      $(_selById(Q_STORE_TABLE)).html('<tr><td>You have ' + m_qStore.length + ' Stored queries</td></tr>');
      var str = '<tr><th class="pm-hdr" colspan="2">Query Description</th><th class="pm-hdr">Last Run</th><th class="pm-hdr">Result count</th></tr>\n';
      for (var i = 0; i < m_qStore.length; i++) {
        var clz = (i % 2) ? 'tr-odd' : 'tr-evn';
        var descr = m_qStore[i].descr;
        str += '<tr class="' + clz + '">\n<td class="cb-col"><input type="checkbox" id="dqcb' + i +'"></td>\n';
        str += '<td><a href="#" onClick="_openQuery(' + i + ')">' + descr + '</td>\n';
        str += '<td class="table-text">' + m_qStore[i].date_last_run + '</td>\n';
        str += '<td class="table-text td-num">' + m_qStore[i].total_last_run + '</td>\n';
        str += '</tr>\n';
      }
      str += '<tr><td colspan="4"><hr class="pm-button-sep"></td></tr>\n';
      str += '<tr><td></td><td colspan="3"><div class="pm-button-bar"><button id="dq-pb1" onClick="_deleteSelectedQueries()">Delete Selected</button></div></td></tr>';
      $(_selById(Q_STORE_TABLE)).html(str);
      $('#dq-pb1').button();
    }
  }
}

/**
 * Deletes the selected (checked) stored queries from the server
 */
function _deleteSelectedQueries ()
{
  var str = '';
  for (var i = 0; i < m_qStore.length; i++) {
    if ($('input#dqcb' + i).is(':checked')) {
      if (str.length > 0) {
        str += ',';
      }
      str += m_qStore[i].id;
    }
  }
  if (str.length === 0) {
    _popupDialog(ALERT, 'No queries selected!');
  }
  else {
    $.get(PM_URI + '/pm/qdel?ids=' + str, function (res) {
      if (res != 'ok') {
        _popupDialog(ALERT, res);
      }
      else {
        _getStoredQueries();
        _popupDialog(INFO, 'Queries deleted Ok.');
      }
    });
  }
}

/**
 * Makes the clicked query the "current" query, ready for execution or modification
 * @param idx
 */
function _openQuery (idx)
{
  m_currentQuery = m_qStore[idx].query;
  switch (m_qStore[idx].query_type) {
  case 's':
    var pat = /&zone=(.+)\&q=(.+)/;
    var params = pat.exec(m_currentQuery);
    m_currentZone = params[1];
    m_currentTerm = params[2];
    $('input#q1').val(decodeURIComponent(m_currentTerm));
    newQuery(true);
    break;
  case 'a':
    $('select#z1').val(m_currentZone);
    break;
  case 'c':
    break;
  }
  
}

/**
 * Swaps different forms of query
 * @param id The one to make visible
 */
function _showQueryForm (id)
{
  $('div#' + m_currentQueryFormPane).toggle('fade','swing',100,
    function () { 
      if ($('div#' + id).hasClass('hidden')) {
        $('div#' + id).toggle(); 
        $('div#' + id).removeClass('hidden');
      }
      $('div#' + id).toggle('fade','swing',100); 
      m_currentQueryFormPane = id;
    });
}

/**
 * Swaps different forms of query
 * @param id The one to make visible
 */
function _showStoredQueryForm (id)
{
  $('div#' + m_currentSaveFormPane).toggle('fade','swing',100,
    function () { 
      if ($('div#' + id).hasClass('hidden')) {
        $('div#' + id).toggle(); 
        $('div#' + id).removeClass('hidden');
      }
      $('div#' + id).toggle('fade','swing',100); 
      m_currentSaveFormPane = id;
    });
}

/**
 * Builds the TROVE query string from user input.
 */
function _createQueryString ()
{
  var str = '';
  switch (m_currentQueryFormPane) {
  case Q_SIMPLE : 
    m_currentZone = 'newspaper';
    m_currentTerm = $('input#q1').val();
    str = '&zone=' + m_currentZone + 
          '&q=' + encodeURIComponent(m_currentTerm);
    break;
  case Q_ADVANCED:
    m_currentZone = $('select#z1').val();
    break;
  case Q_CUSTOM:
    break;
  }  
  return str;
}

/**
 * Reset all state vars to initial values for execution of a new query.
 */
function _resetState ()
{
  _resetMap();

  if (m_resultSet !== null) {
    for (var i = 0; i < m_resultSet.length; i++) {
      if (m_resultSet[i].marker !== null) {
        m_resultSet[i].marker.setPosition(null);
        m_resultSet[i].marker = null;
      }
    }
  }
  
  if (m_locationsCache !== null) {
    for (var lid in m_locationsCache) {
      var locn = m_locationsCache[lid];
      if (locn.listener != null) {
        google.maps.event.removeListener(locn.listener);
        locn.listener = null;
      }
      if (locn.popup != null) {
        locn.popup.close();
        locn.popup = null;
      }
      if (locn.marker !== null) {
        locn.marker.setVisible(false);
        locn.marker.setPosition(null);
        locn.marker = null;
      }
    }
  }
  
  m_queryId++;
  m_run = true;
  m_paused = false;
  m_totalRecs = 0;
  m_fetchSize = 4;
  m_fetchStart = 0;
  m_totalTime  = 0;
  m_rawRecordId = -1;
  m_locationsSum = 0;
  m_trefIndex = new Array();
  m_resultSet = new Array();
  m_yearCount = new Array();
  m_locations = new Array();
  m_rawDateIndex = new Array();
  m_locationsCache = new Array();
  m_currentQuery = _createQueryString();
  $('div#raw-list-container').html('');
  $('div#raw-record-container').html('');
  $('#ctl-table button').button('disable');   
  $('#cc-pb11').button('option', 'label', 'Pause Query');
  $('#cc-pb11').button('disable');   
  var rbGroup = $('input[name="raw-sort-rb"]');
  rbGroup.prop('checked', false);
  rbGroup[3].checked = true;
  $('div#y2k-timeline div').remove();

}

function _updateTimeDisplay ()
{
  var currMillis = new Date().getTime();
  var qTime = currMillis - m_fetchStart;
  m_totalTime += qTime;
  var tsecs = Math.round(m_totalTime / 1000);
  var secs = tsecs % 60;
  var tmins = Math.floor(tsecs / 60);
  var mins  = tmins % 60;
  var hrs   = Math.floor(tmins / 3600);
  $('td#n13').html((hrs < 10 ? '0' : '') + hrs + ':' + (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs);
}

/**
 * Sends off a trove query using the data in the bew query form, starting at the position passed.
 * Clears form if position < zero.
 * @param pos position in TROVE result set
 */
function _doQuery (pos)
{
  // ASSERT m_key != null
  if (pos === 0) {
    _resetState();
    $('#cc-pb11').button('enable');   

  }
  var queryId = m_queryId;
  if (m_fetchSize < MAX_FETCH_SIZE) {
    m_fetchSize = Math.min(MAX_FETCH_SIZE, m_fetchSize * 2);
  }
  var uri = TROVE_QUERY_URL + m_user.key + m_currentQuery + 
            '&s=' + pos + '&n=' + m_fetchSize +
            '&encoding=json' + 
            '&callback=?';

  $.getJSON(uri, function (data, status, jqXHR) {
      try {
        if (status == "success") {
          _updateTimeDisplay();
          _processData(data, pos, queryId);
        }
        else {
          alert('getJSON Error: ' + JSON.stringify(jqXHR));
        }
      }
      catch (ex) {
        alert(ex);
      }
    }).error(function(jqXHR, textStatus, errorThrown) {
      var msg = 'PaperMiner has detected an error on the TROVE server:<br>' + errorThrown +
        '<p>As this may impact your results, we suggest you stop and reexecute your query.' +
        'If the error persists, it may be due to server load, so wait a while. then tryb again.';
      _popupDialog(ALERT, msg, 400);
    });
  m_fetchStart = new Date().getTime();
  $('#busy-box').activity();
  _updateCurrQueryPane();
}

/**
 * Extracts records from a TROVE response placing them in global array.
 * Sends next query if more records exist and (re)starts processing of map pins.
 * If position is negative, the query is aborted and any pending fetch ignored when/if it arrives
 * @param data TROVE JSON response
 * @param pos start location in overall set for this group; or negative to stop the madness
 */
function _processData (data, pos, id)
{
  if (pos === PAUSE_QUERY) {
    if (m_paused) {
      m_paused = false;
      m_run = true;
      $('#busy-box').activity(true);
      $('#cc-pb11').button('option', 'label', 'Pause Query');
      _doQuery(m_resultSet.length);
    }
    else {
      m_run = false;
      m_paused = true;
      $('#busy-box').activity(false);
      $('#cc-pb11').button('option', 'label', 'Resume Query');
    }
    _updateCurrQueryPane();
  }
  else if (m_run && (id === m_queryId)) {
    // FIXME: handle multi zone responses
    var zoneInfo = _getZoneInfo(m_currentZone);
    var res = data.response.zone[0].records[zoneInfo.holder];
    if (res) {
      if (m_totalRecs === 0) {
        m_totalRecs = data.response.zone[0].records.total;
      }
      
      for (var idx = 0; idx < res.length; idx++) {
        m_resultSet[pos + idx] = { zone: zoneInfo.id, data: res[idx], marker:null };
        m_resultSet[pos + idx].data.text = null;
        m_trefIndex[res[idx]['id']] = pos + idx;
      }
      
      // get next chunk underway before doing local housekeeping
      if (m_resultSet.length < m_totalRecs) {
        _doQuery(m_resultSet.length);
      }
      else {
        $('#busy-box').activity(false);
        $('#cc-pb11').button('disable');   
        m_run = false;
        ++m_queryId;
      }
       
      _updateLocationRefs(pos);
      _updateMapDisplay(pos);
      _updateCurrQueryPane();
      
      // swap view on first response unless user already chnged it
      if ((pos === 0) && (m_currentPaneSelector === _selById(NEW_QUERY_PANE)))  {
        currentQuery(true);
      }
    }
  }
}

/**
 * Flips the currently visible pane
 * @param id Selector for pane to display
 */
function _showPane (id)
{
  if ((id != m_currentPaneSelector) && ($(id).length > 0)) {
    $(m_currentPaneSelector).toggle('fade', 'swing', FADE_TD2, function () {
      $(id).toggle('fade', 'swing', FADE_TD2); 
    });
    m_currentPaneSelector = id;
  }
}

/**
 * A popup dialog (non-modal)
 * @param dtype QUESTION, INFO or ALERT
 * @param html formatted content for popup
 */
function _popupDialog (dtype, html, width)
{
  var errOpts = { 
    autoOpen:'true', show:FADE_TD1, hide: FADE_TD1,
    position: [140, 140], 
    resizable:'false', 
    buttons: {'OK' : function () { $(this).dialog('destroy'); $('#user-popup').remove(); }},
    closeOnEscape:'true',
    open: function(event, ui) { $(this).parent().children().children(".ui-dialog-titlebar-close").hide(); }
  };
  var icon = (dtype == ALERT) ? 'ui-icon-alert' : (dtype === INFO) ? 'ui-icon-info' : (dtype === QUESTION) ? 'ui-icon-help' : '';
  $('body').append('<div id="user-popup" style="display:none" title="' + dtype +
      '"><p><span class="ui-icon ' + icon + '" style="float:left; margin:0 7px 20px 0;"></span></p>'+html+'</div>');
  $('#user-popup').dialog(errOpts);
  if (width !== UNDEF) {
    $('#user-popup').dialog('option', 'width', width);
  }
}

/**
 * If the nominated pane does not exist, get its content from the server and create it as hidden,
 * then fade it out, removing the hidden when the fade is done. Pane will be made visible on next toggle.
 * @param id Pane selector
 * @param cssName optional class(es) to apply to new pane
 */
function _createPane (id, callback, cssName) 
{
  if ($(_selById(FOOTER_BAR)).length > 0) {
    var selector = _selById(id);
    $(_selById(FOOTER_BAR)).before('<div id="' + id + '" class="hidden"></div');
    $(selector).toggle('fade', 'swing', 0, function () { 
      $(selector).toggleClass('hidden ' + cssName); 
    });
    // do fetch asynch as Webkit has race condition isuues
    $.ajax({
      url: PM_URI + '/pm?pg=' + id,
      asynch: true,
      dataType: 'text',
      success: function (data) { 
        $(selector).html(data);
        if (callback !== null) {
          callback();
        }
      },
      error: function (jqXHR, textStatus, errorThrown ) { alert('ajax error fetching html for ' + id + '\n' + errorThrown); }
    });
  }
}

/**
 * Checks if a record is inside the timeline range slider markers
 * @param idx Index of record
 * @returns {Boolean} true if in range
 */
function _isInTimelineRange(idx)
{
  var inRange = false;
  var span = $(_selById(Y2K_SLIDER)).slider('value').split(';');
  var ystart = parseInt(span[0]);
  var yend = parseInt(span[1]);
  var zoneInfo = _getZoneInfo(m_resultSet[idx].zone);
  if (zoneInfo.dtag.length > 0) {
    //var date = eval('m_resultSet[idx].data.' + zoneInfo.dtag);
    var date = m_resultSet[idx].data[zoneInfo.dtag];
    var year = date;
    if (year.length > 4) {
      var isoDate = /(\d\d\d\d)-\d\d-\d\d/;
      var mat = year.match(isoDate);
      if (mat != null) {
        year = parseInt(mat[1]);
      }
    }
    inRange = (year >= ystart) && (year <= yend);
  }
  return inRange;
}

/**
 * Configure the default Y2K slider
 */
function _initSlider ()
{
  $(_selById(Y2K_SLIDER)).slider({ 
    from: 1800, 
    to: 2000, 
    heterogeneity: ['25/1850', '75/1950'], 
    scale: [1800, 1825, 1850, 1875, 1900, 1925, 1950, 1975, 2000], 
    limits: false, 
    step: 1, 
    dimension: '', 
    callback: function( value ){ toggleMapMarkers(); } 
  });  
}

/**
 * Creates a Google map marker for a record and sets its initial visibility from
 * the timeline range markers. Hover text will be set to the source if zone is newspaper.
 * @param idx Index of record
 * @param data
 */
function _insertPublisherMapMarker (idx, data)
{
  var pos = new google.maps.LatLng(data.latitude, data.longitude);
  var pin = new google.maps.Marker( { position: pos, map: m_map, } );
  var isViz = (_getCheckedMapButton() === PUBLISHER_MARKER);
  pin.setTitle(data.title);
  pin.setVisible(isViz && _isInTimelineRange(idx));
  pin.setIcon('images/int16.png');
  m_resultSet[idx].marker = pin;
}

/**
 * returns currently checked map marker button.
 */
function _getCheckedMapButton ()
{
  return parseInt($('#map-options input[name=radio-map]:checked').val());
}

/**
 * Adds timeline markers and map publisher pins for new records just received
 * starting at pos in global result array until the end.
 * The color of all timeline entries are revised based on the current
 * percentile groupings.
 * @param pos array offset.
 */
function _updateMapDisplay (pos)
{
  var _addMarker = function (idx)
  {
    // FIXME: only newspaper will have this
    //var pubId = eval(m_resultSet[idx].data.title.id);
    var pubId = m_resultSet[idx].data.title.id;
    var info = m_pubCache[pubId];
    if (typeof info !== UNDEF) {
      _insertPublisherMapMarker(idx, info);
    }
    else {
      var uri = PM_URI + '/pub/info?id=' + pubId;
      $.getJSON(uri, function (data, status, jqXHR) {
        if (status == "success") {
          m_pubCache[pubId] = data;
          _insertPublisherMapMarker(idx, data);
        }
      });
    }
  };
  
  for (var i = pos; i < m_resultSet.length; i++) {
    var zoneInfo = _getZoneInfo(m_resultSet[i].zone);
    //var year = eval('m_resultSet[i].data.' + zoneInfo.dtag);
    var year = m_resultSet[i].data[zoneInfo.dtag];
    if (typeof year != 'undefined') {
      if (typeof year == 'number') {
        year = year.toString();
      }
      else {
        var isoDate = /(\d\d\d\d)-\d\d-\d\d/;
        var mat = year.match(isoDate);
        if (mat != null) {
          year = mat[1];
        }
        else {
          continue;
        }
      }
      if (m_yearCount[year] != null) {
        m_yearCount[year].cnt++;
        m_yearCount[year].refs.push(m_resultSet[i].data.id);
      }
      else {
        m_yearCount[year] = { cnt:1, refs: new Array() };
        m_yearCount[year].refs.push(m_resultSet[i].data.id);
      }
      
      _addMarker(i);
    }
  }
  _updateTimelineMarkerColors();
}

/**
 * (re)set the color of all map markers based on hit count percentage per year
 */
function _updateTimelineMarkerColors ()
{
  var __innerCreate = function (idx, year, leftPos, color) {
    var topPos = $(_selById(Y2K_TIMELINE_BAR)).offsetTop;
    var css1 = { 'background-color': color, 'left': leftPos, 'top': topPos };
    $(_selById(Y2K_TIMELINE_BAR)).append($('<div class="year-marker info" id="y' + idx + '">' +
        '<a href="#" onClick="_viewRawByYear(' + idx + ')" class="timeline-hotspot">' +
        '<span>' + year + '</span></a></div>'));
    $('div#y' + idx).css(css1);
  };
  
  for (var key in m_yearCount) {
    var yearVal = parseInt(key);
    if (! isNaN(yearVal) && yearVal > 0) {
      var cnt = m_yearCount[key].cnt;
      var color = '';
      var pct = 100 * cnt / m_resultSet.length;
      for (var idx = 0; idx < FREQ_DISTR.length; idx++) {
        if (pct > FREQ_DISTR[idx][0] && pct <= FREQ_DISTR[idx][1]) {
          color = '#' + FREQ_DISTR[idx][2] + ';';
          break;
        }
      }
      var id = 'div#y' + key;
      if ($(id).length > 0) {
        $(id).css({ 'background-color': color });
      }
      else {
        var px = ((yearVal - 1800) * YEAR_PX) + YEAR_OFFSET;
        __innerCreate(key, yearVal, px, color);
        //$(_selById(Y2K_TIMELINE_BAR)).append($('<div class="year-marker info" id="y' + key + '">' +
            //'<span>' + yearVal + '</div>'));
        //$(id).css({ 'background-color': color, 'left': px, 'top': $(_selById(Y2K_TIMELINE_BAR)).offsetTop });
      }
    }
  }
}

/**
 * Gets references to PM GS data for all TROVE IDs in result set starting at <pos>,
 * then fetches actual GS data for those we don't already have cached.
 * @param pos
 */
function _updateLocationRefs (pos)
{
  var arg = '';
  for (var i = pos; i < m_resultSet.length; i++) {
    //var zoneInfo = _getZoneInfo(m_resultSet[i].zone);
    //var troveId = eval('m_resultSet[i].data.' + zoneInfo.tags[0].tag);
    var troveId = m_resultSet[i].data.id;
    arg += ',' + troveId;
    m_locations[troveId] = { pos: i, list: new Array() };
  }
  arg = arg.substring(1);
  
  var uri = PM_URI + '/loc/ref?lst=' + arg;
  $.getJSON(uri, function (data, status, jqXHR) {
    if (status == "success") {
      if (data.refs != UNDEF) {
        // associative array 'tmp' tracks duplicate location refs for unloaded locations
        var tmp = new Array();
        var list = data.refs;
        for (var troveRef in list) {
          for (var k = 0; k < list[troveRef].length; k++) {
            m_locations[troveRef].list.push(list[troveRef][k]);
          }
          for (var i = 0; i < m_locations[troveRef].list.length; i++) {
            var locnId = m_locations[troveRef].list[i][0];
            if (! (locnId in m_locationsCache)) {
              tmp[locnId] = '';
              m_locationsCache[locnId] = {
                  info: null, 
                  marker: null,
                  popup: null,
                  tids: new Array(troveRef), 
                  total: parseInt(m_locations[troveRef].list[i][1]), 
                  yMin: parseInt(m_resultSet[m_trefIndex[troveRef]].data.date.substring(0,4)), 
                  yMax: parseInt(m_resultSet[m_trefIndex[troveRef]].data.date.substring(0,4))
              };
              m_locationsSum += m_locationsCache[locnId].total;
            }
            else {
              var obj = m_locationsCache[locnId];
              obj.total += parseInt(m_locations[troveRef].list[i][1]);
              obj.tids = obj.tids.concat(troveRef);
              var yr = parseInt(m_resultSet[m_trefIndex[troveRef]].data.date.substring(0,4));
              obj.yMin = Math.min(yr, obj.yMin);
              obj.yMax = Math.max(yr, obj.yMax);
              if (obj.marker != null) {
                var isViz = (_getCheckedMapButton() === LOCATION_MARKER);
                obj.marker.setVisible(isViz && _isRangeOverlap(obj.yMin, obj.yMax));
              }
            }
          }
        }
        var locnIds = '';
        for (var lid in tmp) {
          locnIds += ',' + lid;
        }
        locnIds = locnIds.substring(1);
        if (locnIds.length > 0) {
          _getLocationData(locnIds);
        }
      }
    }
  }); 
}

/**
 * Fetches actual GS data by its DB id and stores it in our cache
 * Creates google map marker for location.
 * @param list
 */
function _getLocationData (list)
{
  var uri = PM_URI + '/loc/gs?lst=' + list;
  $.getJSON(uri, function (data, status, jqXHR) {
    if (status == "success") {
      if (data.locns !== UNDEF) {
        var locnData = data.locns;
        for (var locnId in locnData) {
          m_locationsCache[locnId].info = locnData[locnId];
          _createMapLocationMarker(locnId);
          _createMarkerPopup(locnId);
        }
      }
      _updateLocationMarkerColors();
    }
  }); 
}

/**
 * Creates a map marker from location data, setting title and visibility with a default pin color
 * @param locnId index of location in cache
 * @returns {google.maps.Marker}
 */
function _createMapLocationMarker (locnId)
{
  var info = m_locationsCache[locnId].info;
  var pos = new google.maps.LatLng(info.latitude, info.longitude);
  var pin = new google.maps.Marker( { position: pos, map: m_map, } );
  var isViz = (_getCheckedMapButton() === LOCATION_MARKER);
  var title = info.name;
  if ((info.state_sn !== UNDEF) && (info.state_sn.length > 0)) {
    title += ', ' + info.state_sn;
  }
  pin.setTitle(title);
  pin.setVisible(isViz && _isRangeOverlap(m_locationsCache[locnId].yMin, m_locationsCache[locnId].yMax));
  pin.setIcon('images/int1.png');
  m_locationsCache[locnId].marker = pin;
}

/**
 * Creates the google Info Window popup for a specific location, and provides dynamic content
 * when the info window is opened.
 * Note! This is a separate function because of closure requirements.
 * @param locId Index into the location cache array.
 */
function _createMarkerPopup (locId)
{
  m_locationsCache[locId].popup = new google.maps.InfoWindow({ content: '', disableAutoPan: true });
  m_locationsCache[locId].listener = google.maps.event.addListener(m_locationsCache[locId].marker, 'click', function () {
    var k1 = m_locationsCache[locId].total > 1 ? ' times in ' : ' time in ';
    var k2 = m_locationsCache[locId].tids.length > 1 ? ' records.' : ' record.';
    var html = '<div class="marker-popup">' + m_locationsCache[locId].info.name + 
            ((m_locationsCache[locId].info.state_sn.length > 0) ? ', ' + m_locationsCache[locId].info.state_sn : '') +
            '<br>Occurs ' + m_locationsCache[locId].total + k1 + m_locationsCache[locId].tids.length + k2 +
            '<p><button id="loc-pb' + locId + '" onClick="_viewLocationRecords(' + locId + ')">View Records...</button></div>';
    m_locationsCache[locId].popup.setContent(html);
    m_locationsCache[locId].popup.open(m_map, m_locationsCache[locId].marker);
    $('button#loc-pb' + locId).button();
  });
}

/**
 * Marks the location(s) for a specific trove ID as deleted. Updates data structs to
 * remove location, its hit count, and zonks the marker if the count reaches zero.
 * @param locnList
 * @param troveId
 */
function _strikeOutLocations (locnList, troveId)
{    
  var uri = PM_URI + '/loc/rm?lid=' + locnList.join(',') + '&tid=' + troveId + '&uid=' + m_user.id;
  $.getJSON(uri, function (data, status, jqXHR) {
    var cnt = 0;
    if (status == "success") {
      cnt = parseInt(data.rm);
    }
    
    if (cnt !== locnList.length) {
      _popupDialog(ALERT, "delete failed");
    }
    else {
      var locnSet = new Array();
      for (var i = 0; i < locnList.length; i++) {
        locnSet[locnList[i]] = null;
      }
      var stack = new Array();
      var locnEntry =  m_locations[troveId];
      for (var i = 0; i < locnEntry.list.length; i++) {
        var lid = locnEntry.list[i][0];
        if (! (lid in locnSet)) {
          stack.push(locnEntry.list[i]);
        }
        else {
          m_locationsSum -= locnEntry.list[i][1];
          m_locationsCache[lid].total -= locnEntry.list[i][1];
          for (var k = 0; k < m_locationsCache[lid].tids.length; k++) {
            if (m_locationsCache[lid].tids[k] === troveId) {
              m_locationsCache[lid].tids.splice(k, 1);
              break;
            }
          }
          _resetLocationMaxMinYear(lid);
          if (m_locationsCache[lid].total <= 0) {
            m_locationsCache[lid].marker.setVisible(false);
          }
        }
      }
      locnEntry.list = (stack.length > 0) ? stack : null;
      _updateLocationsListDisplay(m_rawRecordId);
      _updateLocationMarkerColors();
    }
  });
}

/**
 * Resets the year range for TROVE results referring to this location ID
 * @param locnId
 */
function _resetLocationMaxMinYear (locnId)
{
  if (m_locationsCache[locnId].tids.length === 0) {
    m_locationsCache[locnId].yMin = 0;
    m_locationsCache[locnId].yMax = 0;
  }
  else {
    for (var i = 0; i < m_locationsCache[locnId].tids.length; i++) {
      var troveId = m_locationsCache[locnId].tids[i];
      var idx = m_locations[troveId].pos;
      var data = m_resultSet[idx].data;
      var yr = parseInt(data.date.substring(0,4));
      if (i === 0) {
        m_locationsCache[locnId].yMin = yr;
        m_locationsCache[locnId].yMax = yr;
      }
      else {
        m_locationsCache[locnId].yMin = Math.min(yr, m_locationsCache[locnId].yMin);
        m_locationsCache[locnId].yMax = Math.max(yr, m_locationsCache[locnId].yMax);
      }
    }
  }
}

/**
 * Prepares a list of trove records referenced by a mined location and sets them up is sorted data order
 * in the Raw View pane.
 * @param locnId Index into the location cache array.
 */
function _viewLocationRecords (locnId)
{
  m_locationsCache[locnId].popup.close();
  var tmp = new Array();
  for (var i = 0; i < m_locationsCache[locnId].tids.length; i++) {
    var tref = m_locationsCache[locnId].tids[i];
    var j = m_trefIndex[tref];
    var zoneInfo = _getZoneInfo(m_resultSet[j].zone);
    var date = eval('m_resultSet[j].data.' + zoneInfo.dtag);
    tmp[i] = { idx: j, val: date, hover: '' };
  }
  
  tmp.sort(function(a,b) {
    return a.val > b.val ? 1 :
           a.val < b.val ? -1 : 0;
  });
  
  $('div#raw-list-container').html('');
  $('div#raw-record-container').html('');
  _resetRawRecordList (tmp);
  _showPane(_selById(RAW_VIEW));
  var rbGroup = $('input[name="raw-sort-rb"]');
  rbGroup.prop('checked', false);
  rbGroup[0].checked = true;
}

/**
 * Adjust all 'active' location map marker icon colors based on the BOM color scale and percentage 
 * the frequency total for each is of the total location hit count.
 */
function _updateLocationMarkerColors ()
{
  for (var locn in m_locationsCache) {
    var cnt = m_locationsCache[locn].total;
    var color = 'images/int';
    var pct = 100 * cnt / m_locationsSum;
    for (var i = 0; i < FREQ_DISTR.length; i++) {
      if (pct > FREQ_DISTR[i][0] && pct <= FREQ_DISTR[i][1]) {
        color += (i + 1);
        m_locationsCache[locn].marker.setZIndex(i + MARKER_Z_BASE);
        break;
      }
    }
    m_locationsCache[locn].marker.setIcon(color + '.png');
  }
}

/**
 * Checks if a range of years lies all or part within the current timelime marker positions
 * @param ymin
 * @param ymax
 * @returns {Boolean}
 */
function _isRangeOverlap (ymin, ymax)
{
  var span = $(_selById(Y2K_SLIDER)).slider('value').split(';');
  var ystart = parseInt(span[0]);
  var yend = parseInt(span[1]);
  var res = (ymax >= ystart) && (ymin <= yend);
  return res;
}

function _setCurrentQueryButtonState ()
{
  //$('button#cc-pb11').button((m_run ? 'enable' : 'disable'));   // || (m_resultSet == null) || (m_totalRecs > 0 && m_resultSet.length >= m_totalRecs)));
  $('button#cc-pb12').button((m_currentQuery == null ? 'disable' : 'enable'));
  $('button#cc-pb13').button((m_currentQuery == null ? 'disable' : 'enable'));
}

/**
 * Populate details about the current query progress
 */
function _updateCurrQueryPane ()
{
  if ($(_selById(CURR_QUERY_PANE)).length > 0) {
    switch (m_currentQueryFormPane) {
    case Q_SIMPLE : 
      $('td#q11').html(m_currentTerm);
      $('td#z11').html(m_currentZone);
      $('td#n11').html(m_totalRecs);
      $('td#n12').html(m_resultSet == null ? 0 : m_resultSet.length);
      _setCurrentQueryButtonState();
      break;
    case Q_ADVANCED :
      // FIXME: todo
      break;
    case Q_CUSTOM :
      // FIXME: todo
      break;
    }
  }
}

/**
 * Creates a new list of identifiers for trove records in the scrollable left hand panel
 * of the Raw View pane.
 * @param list Structure of identifiers, link indicies, and optional hover text.
 */
function _resetRawRecordList (list)
{
  if (list != null) {
    var listData =  '';
    var prefix = '';
    var len = list.length;
    for (var idx = 0; idx < len; idx++) {
      listData += prefix + '<a class="raw-data-selector info" href="#" onClick="_displayRawDataItem(' + list[idx].idx + ')">';
      if (list[idx].hover.length > 0) {
        listData += '<span>' + list[idx].hover + '</span>';
      }
      listData += list[idx].val + '</a>\n';
      prefix = '<br>';
    }
    $('div#raw-list-container').html(listData);
    $('input#pb-r1').attr('disabled','true');
    $('input#pb-r2').attr('disabled','true');
    if (list.length === 1) {
      _displayRawDataItem(list[0].idx);
    }
    else {
      $('div#raw-record-container').html('');
      $('button#rdv-pb3').button('disable');
    }
  }
}

/**
 * Returns a structure giving the *possible* structure of a trove JSON response
 * (TROVE has no schema for these!)
 * @param zone
 * @returns
 */
function _getZoneInfo (zone)
{
  var zoneInfo = null;
  switch (zone) {
  case 'newspaper':  zoneInfo = ZONE_NEWSPAPER; break;
  case 'article':    zoneInfo = ZONE_ARTICLE; break;
  case 'picture':    zoneInfo = ZONE_PICTURE; break;
  case 'map':        zoneInfo = ZONE_MAP; break;
  case 'list':       zoneInfo = ZONE_LIST; break;
  case 'music':      zoneInfo = ZONE_MUSIC; break;
  case 'collection': zoneInfo = ZONE_COLLECTION; break;
  case 'book':       zoneInfo = ZONE_BOOK; break;
  }
  return zoneInfo;
}

/**
 * Display info contained in a response
 * @param id Index in result set of record
 */
function _displayRawDataItem (id)
{
  var rec = m_resultSet[id];
  var zoneInfo = _getZoneInfo(rec.zone);
  var html = '<table id="raw-record"><tr><td class="td-crud-name">Zone:</td><td>' + rec.zone + '</td></tr>';
  for (var i = 0; i < zoneInfo.tags.length; i++) {
    // have to eval this as tag may be double level dotted ref
    var value = eval('m_resultSet[' + id + '].data.' + zoneInfo.tags[i].tag);
    if ((value === null) && (zoneInfo.tags[i].tag == 'text')) {
      html += '<tr><td class="td-crud-name">' + zoneInfo.tags[i].title + ':</td><td><button id="rdv-pbx" onClick="refreshRecord()">Load full text</button></td></tr>';
    }
    else if (zoneInfo.tags[i].isLink) {
      html += '<tr class="hidden"><td>' + zoneInfo.tags[i].title + ':</td><td>' +
      '<a id="raw-trove-link" href="' + value + '" target="_blank">' + value + '</a></td></tr>';
    }
    else {
      html += '<tr><td class="td-crud-name">' + zoneInfo.tags[i].title + ':</td><td>' + value + '</td></tr>';
    }
  }
  html += '</table>';
  $(_selById(RAW_RECORD)).html(html);
  m_rawRecordId = id;
  if (m_currentZone === 'newspaper') {
    $('button#rdv-pb1').button('enable');
  }
  $('button#rdv-pb3').button('enable');
}

/**
 * Retrieve full text and display in Location editor Pane
 */
function _getFullTextForLocation () 
{
  if (m_resultSet[m_rawRecordId].data.text != null) {
    _displayLocationEditText(m_rawRecordId);
  }
  else {
    var uri = TROVE_URL + m_currentZone + '/' + m_resultSet[m_rawRecordId].data.id + 
    '?key=' + m_user.key + 
    '&encoding=json' +
    '&include=articletext' + 
    '&callback=?';
    $.getJSON(uri, function (data, status, jqXHR) {
      if (status == "success") {
        var record = data['article'];
        if (record) {
          if (typeof record.articleText === UNDEF) {
            m_resultSet[m_rawRecordId].data.text = '&lt;nil&gt;';
          }
          else {
            var text =  record.articleText.toString();
            text = text.replace(/<p>/g, '');
            text = text.replace(/<\/p>/g, '');
            m_resultSet[m_rawRecordId].data.text = text;
          }
          _displayLocationEditText(m_rawRecordId);
        }
      }
    });  
  }
}

/**
 * Display snipped and full text (or button) for location editing.
 * @param id
 */
function _displayLocationEditText (id)
{
  var text = m_resultSet[id].data.text;
  var html = '<table id="raw-record"><tr><td class="td-crud-name">ID:</td><td>' + m_resultSet[id].data.id + '</td></tr>' +
             '<td class="td-crud-name">Source:</td><td>' + m_resultSet[id].data.title.value + '</td></tr>' +
             '<td class="td-crud-name">Snippet:</td><td>' + m_resultSet[id].data.snippet + '</td></tr>' +
             '<tr><td class="td-crud-name">Full Text:</td><td>';
  html += ((text === null) ? '<button id="rdv-pbx" onClick="_getFullTextForLocation()">Load full text</button>' : text);
  html += '</td></tr></table>';
  $(_selById('record-text-container')).html(html);
}

/**
 * Builds a table showing location names (with state/country as appropriate) for a TROVE record
 * with a checkbox for deletion selection and displays it in the edit locations pane.
 * @param id
 */
function _updateLocationsListDisplay (id)
{
  var tref = m_resultSet[id].data.id;
  var html = '<table><tr><td>No Locations set</td></tr>';
  if (tref in m_locations) {
    var locns = m_locations[tref];
    if (locns.list !== null) {
      html = '<table>';
      for (var i = 0; i < locns.list.length; i++) {
        var locnId = locns.list[i][0];
        var info = m_locationsCache[locnId].info;
        var sfx = (info.state_sn.length > 0) ? ', ' + info.state_sn :
                  (info.iso_ln !== UNDEF) ? ' (' + info.iso_ln + ')' : '';
        html += '<tr><td class="cb-col"><input type="checkbox" id="x' + locnId + '"></td><td>' + info.name + sfx + '</td></tr>';
      }
      html += '</table>';
    }
  }
  $(_selById('location-list-container')).html(html);
}

/**
 * Builds a sorted index by type into the raw data array
 * @param sortType 1..4 (date, relevance, source, unsorted)
 */
function _sortRaw (sortType)
{
  var isInRange = function (idx) {
    var inRange = true;
    if (m_restrictRawList) {
      inRange = _isInTimelineRange(idx);
    }
    return inRange;
  };
  
  var tmp = new Array();
  try {
    switch (sortType) {
    case 0:
      m_restrictRawList = $('input#raw-select-cb').is(':checked');
      break;
    case 1:
    case 4:
      for (var i = 0, j = 0; i < m_resultSet.length; ++i) {
        var zoneInfo = _getZoneInfo(m_resultSet[i].zone);
        if ((zoneInfo.dtag.length > 0) && isInRange(i)) {
          var date = eval('m_resultSet[i].data.' + zoneInfo.dtag);
          tmp[j++] = { idx: i, val: date, hover: '' };
        }
      }
      break;
    case 2:
      for (var i = 0, j = 0; i < m_resultSet.length; ++i) {
        var zoneInfo = _getZoneInfo(m_resultSet[i].zone);
        if ((zoneInfo.rtag.length > 0) && isInRange(i)) {
          var score = eval('m_resultSet[i].data.' + zoneInfo.rtag);
          var tval = parseFloat(score);
          tmp[j++] = { idx: i, val: tval, hover: '' };
        }
      }
      break;
    case 3:
      for (var i = 0, j = 0; i < m_resultSet.length; ++i) {
        var zoneInfo = _getZoneInfo(m_resultSet[i].zone);
        if ((zoneInfo.stag.length > 0) && isInRange(i)) {
          var srcId = eval('m_resultSet[i].data.' + zoneInfo.stag);
          var lab = (typeof m_pubCache[srcId] !== UNDEF) ? m_pubCache[srcId].title : '';
          var srcid = '000000' + srcId;
          tmp[j++] = { idx: i, val: srcid.substring(srcid.length - 6, srcid.length), hover: lab };
        }
      }
    }
  }
  catch (err) {
    // FIXME: debug stop
    var x = err;
  }
  
  if (tmp.length > 0) {
    if (sortType === 2) {
      tmp.sort(function(a,b) {
        return a.val > b.val ? -1 :
               a.val < b.val ? 1 : 0;
      });
    }
    else if (sortType !== 4) {
      tmp.sort(function(a,b) {
        return a.val > b.val ? 1 :
               a.val < b.val ? -1 : 0;
      });
    }
    _resetRawRecordList (tmp);
  }
}

/**
 * Action when a timeline marker clicked builds a list of records for that year and activates RAW view
 * @param idx Index into year array.
 */
function _viewRawByYear (idx)
{
  var tmp = new Array();
  for (var i = 0; i < m_yearCount[idx].refs.length; i++) {
    var rsi = m_trefIndex[m_yearCount[idx].refs[i]];
    var zoneInfo = _getZoneInfo(m_resultSet[rsi].zone);
    var date = eval('m_resultSet[rsi].data.' + zoneInfo.dtag);
    tmp[i] = { idx: rsi, val: date, hover: '' };
  }

  tmp.sort(function(a,b) {
  return a.val > b.val ? 1 :
         a.val < b.val ? -1 : 0;
  });
  
  $('div#raw-list-container').html('');
  $('div#raw-record-container').html('');
  _resetRawRecordList (tmp);
  _showPane(_selById(RAW_VIEW));
  var rbGroup = $('input[name="raw-sort-rb"]');
  rbGroup.prop('checked', false);
  rbGroup[0].checked = true;
}

/**
 * Basic layout for add location dailog
 * @param text User-selected text to display
 * @returns {String}
 */
function _formatAddLocations (text)
{
  var html = '<div id="add-locns-dlg">' +
      '<table id="add-locn-find"><tr><th>Place Name</th><th>State</th><th>Country</th></tr><tr>' +
      '<td><input id="add-locn-name"  type="text" value="' + text + '"></td>' +
      '<td><input id="add-locn-state" type="text" value=""></td>' +
      '<td><input id="add-locn-cntry" type="text" value=""></td></tr></table>' +
      '<br>&nbsp;<table id="add-locns"></table' +
      '</div>';
  return html;
}

/**
 * Find a location name (optionally with state and/or country) from our database, or google geocode service.
 * The location data is appended to the array of locations found since the add dialog was opened.
 * @param src
 */
function _findLocation (src)
{
  var __getNames = function(list, tag) {
    var res = { sn:'', ln:'' };
    for (var i = 0; i < list.length; i++) {
      for (var j = 0; j < list[i].types.length; j++) {
        if (list[i].types[j] === tag) {
          res.sn = list[i].short_name;
          res.ln = list[i].long_name;
          break;
        }
      }
    }
    return res;
  };

  var ln = $('#add-locn-name').val();
  var sn = $('#add-locn-state').val();
  var cn = $('#add-locn-cntry').val();
  if (src === 0) {
    var uri = PM_URI + '/loc/q?ln=' + ln + '&sn=' + sn + '&cn=' + cn;
    $.getJSON(uri, function (data, status, jqXHR) {
      if (status == "success") {
        if (data.length === 0) {
          _popupDialog(INFO, 'Location not in the Paper Miner database.');
          return;
        }
        for (var i = 0; i < data.length; i++) {
          m_locnSelections.push(data[i]);
        }
        _formatLocationSelections();
      }
    });
  }
  else {
    var uri = GOOGLE_MAPS_URL + ln + 
    (sn.length > 0 ? '+' + sn : '') +
    (cn.length > 0 ? '+' + sn : '') +
    '&sensor=false';
    $.getJSON(uri, function (data, status, jqXHR) {
      if (status == "success") {
        if ( data.results.length === 0) {
          _popupDialog(INFO, 'No results from Google Maps for this Location.');
          return;
        }
        try {
          var list = new Array();
          for (var i = 0; i < data.results.length; i++) {
            var obj = data.results[i];
            var state = __getNames(obj.address_components, 'administrative_area_level_1');
            var cntry = __getNames(obj.address_components, 'country');
            var tmp = {
                id: "0",
                state_sn: state.sn,
                state_ln: state.ln,
                iso_sn: cntry.sn,
                iso_ln: cntry.ln,
                name: obj.address_components[0].long_name,
                latitude: obj.geometry.location.lat,
                longitude: obj.geometry.location.lng,
                box_nw_lat: obj.geometry.bounds.northeast.lat,
                box_nw_lng: obj.geometry.bounds.northeast.lng,
                box_se_lat: obj.geometry.bounds.southwest.lat,
                box_se_lng: obj.geometry.bounds.southwest.lng,
            };
            list.push(tmp);
          }
          m_locnSelections = m_locnSelections.concat(list);
        }
        catch (ex) {
          _popupDialog(ALERT, "The results are ambiguous. Please try specifying a state, and/or Country.");
        }
      }
      _formatLocationSelections();
    });
  }
}

/**
 * Formates the list of locations "found" since the add location dialog was opened
 * and displayes them in the dialog.
 */
function _formatLocationSelections ()
{
  var tdat = '';
  for (var i = 0; i < m_locnSelections.length; i++) {
    var locn = m_locnSelections[i];
    tdat += '<tr><td class="sel-name">' + locn.name + 
            '</td><td class="sel-state">' + locn.state_sn + 
            '</td><td class="sel-cntry">' + locn.iso_ln + 
            '</td><td class="sel-accept"><button onClick="_addNewLocation(' + i + ')">Accept</button></td></tr>';
  }
  $('#add-locns').html(tdat);
}

/**
 * Adds the selected location to the current trove record
 * @param idx Index of selected location element
 */
function _addNewLocation(idx)
{
  $('#add-locns-dlg').dialog('close');

  var re = new RegExp($('#add-locn-name').val(), 'ig');
  var hits = m_resultSet[m_rawRecordId].data.text.match(re);
  var freq = (hits === null) ? 1 : hits.length;
  if (m_locnSelections[idx].id > 0) {
    _addReference(m_resultSet[m_rawRecordId].data.id, m_locnSelections[idx], freq);
  }
  else {
    _addLocation(m_resultSet[m_rawRecordId].data.id, m_locnSelections[idx], freq);
  }
}

/**
 * Adds a new reference to an existing location for a TROVE id with a frequency count.
 * @param troveId The Trove ID
 * @param locnId The index in the locations cache
 * @param freq Occurence count for the location in the TROVE record
 */
function _addReference (troveId, obj, freq)
{
  var locnId = obj.id;
  var uri = PM_URI + '/loc/add?uid=' + m_user.id + '&tid=' + troveId + '&lid=' + locnId + '&freq=' + freq;
  $.getJSON(uri, function (data, status, jqXHR) {
    if (status === "success") {
      if (data.res !== "ok") {
        _popupDialog(ALERT, "Unable to add location for this record");
      }
      else {
        if (typeof m_locationsCache[locnId] === UNDEF) {
          m_locationsCache[locnId] = { 
              info:  obj,
              total: 0,
              yMin:  parseInt(m_resultSet[m_locations[troveId].pos].data.date.substring(0,4)),
              yMax:  parseInt(m_resultSet[m_locations[troveId].pos].data.date.substring(0,4)),
              tids:  new Array(),
              popup: null,
              marker: null,
              listener: null
          };
          _createMapLocationMarker(locnId);
          _createMarkerPopup(locnId);
        }
        var isViz = (_getCheckedMapButton() === LOCATION_MARKER) && 
                     _isRangeOverlap(m_locationsCache[locnId].yMin, m_locationsCache[locnId].yMax);
        m_locationsSum += freq;
        m_locationsCache[locnId].total += freq;
        m_locationsCache[locnId].tids.push(troveId);
        m_locationsCache[locnId].marker.setVisible(isViz);
        m_locations[troveId].list.push([locnId, freq.toString()]);
        _resetLocationMaxMinYear(locnId);
        _updateLocationMarkerColors();
        _updateLocationsListDisplay(m_locations[troveId].pos);
      }
    }
  });
}

/**
 * Adds a new location and a new reference to it.
 * @param troveId The record referencing the new location
 * @param obj The info details for the new location
 * @param freq Count of occurences of location in record
 */
function _addLocation (troveId, obj, freq)  
{
  var uri = PM_URI + '/loc/ins?uid=' + m_user.id + '&tid=' + troveId + '&freq=' + freq +
            '&nm=' + obj.name +
            '&ssn=' + obj.state_sn +
            '&sln=' + obj.state_ln +
            '&csn=' + obj.iso_sn +
            '&cln=' + obj.iso_ln +
            '&lat=' + obj.latitude +
            '&lng=' + obj.longitude +
            '&nwlat=' + obj.box_nw_lat +
            '&nwlng=' + obj.box_nw_lng +
            '&selat=' + obj.box_se_lat +
            '&selng=' + obj.box_se_lng;
  $.getJSON(uri, function (data, status, jqXHR) {
    if (status == "success") {
      var locnId = parseInt(data.lid);
      if (locnId <= 0) {
        _popupDialog(ALERT, "Unable to insert location for this record");
      }
      else {
        m_locationsSum += freq;
        obj.id = locnId;
        m_locations[troveId].list.push([locnId, freq]);
        m_locationsCache[locnId] = { 
            info: obj,
            total: freq,
            yMin: parseInt(m_resultSet[m_locations[troveId].pos].data.date.substring(0,4)),
            yMax: parseInt(m_resultSet[m_locations[troveId].pos].data.date.substring(0,4)),
            tids: [ troveId ],
            popup: null,
            marker: null,
            listener: null
        };
        _createMapLocationMarker(locnId);
        _createMarkerPopup(locnId);
        _resetLocationMaxMinYear(locnId);
        _updateLocationMarkerColors();
        _updateLocationsListDisplay(m_locations[troveId].pos);
      }
    }
  });
}

/**
 * Deletes selected locations from currently selected/displayed raw record.
 */
function locnDel ()
{
  var tmp = new Array();
  var cbs = $('#location-list-container input');
  for (var i = 0, j = 0; i < cbs.length; i++) {
    var id = cbs[i].id;
    if ($('input#'+id).is(':checked')) {
      tmp[j++] = id.substring(1);
    }
  }
  
  if (tmp.length === 0) {
    _popupDialog(ALERT, "No locations marked for removal!");
  }
  else {
    _strikeOutLocations(tmp, m_resultSet[m_rawRecordId].data.id);
  }
}



// EOF


