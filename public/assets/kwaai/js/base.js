/**
 * @file
 * Base layout JavaScript resources.
 *
 * All DecimaERP code is copyright by the original authors and released under the GNU Aferro General Public License version 3 (AGPLv3) or later.
 * See COPYRIGHT and LICENSE.
 */

/**
 * Close tab and destroy its content.
 *
 * @param string id
 * 	App ID
 *
 *  @returns void
 */
function closeTab(id)
{
	if($('a[href=#' + id +']').parent().hasClass('active'))
	{
		destroyApp(id);
		$('#apps-tabs a:last').click();
	}
	else
	{
		destroyApp(id);
	}

	if($('#apps-tabs').children().length == 0)
	{
		$('#user-apps-content').hideModulesApps();
	}
}

/**
 * Destoy app's html elements.
 *
 * @param string id
 * 	App ID
 *
 *  @returns void
 */
function destroyApp(id)
{
	$('a[href=#' + id +']').parent().remove();
	$('#' + id).remove();
}

/**
 * On click tab event.
 *
 * @param string url
 *
 *  @returns void
 */
function onClickTabEvent(url)
{
	changeWindowsUrl(url);
	$('#user-apps-content').hideModulesApps();
	setCurrentApp();
}

/**
 * Send a request to change current user organization.
 *
 * @param integer id
 *
 *  @returns void
 */
function changeLoggedUserOrganization(id)
{
	$.ajax(
	{
		type: 'POST',
		data: JSON.stringify({'id':id, '_token':$('#app-token').val()}),
		url: $('#app-url').val() + '/general-setup/security/user-management/change-logged-user-organization',
		beforeSend:function()
		{
			$('#app-loader').removeClass('hidden');
			disabledAll();
		},
		success:function()
		{
			window.location.replace($('#app-url').val());
		}
	});
}

/**
* Send a request to change current user organization.
*
* @param integer id
*
*  @returns void
*/
function changePopoverStatus(popovers, organizationPopover)
{
	$.ajax(
	{
		type: 'POST',
		data: JSON.stringify({'popovers_shown':popovers, 'multiple_organization_popover_shown':organizationPopover, '_token':$('#app-token').val()}),
		url: $('#app-url').val() + '/general-setup/security/user-management/update-logged-user-popover-status'
	});
}

/**
 * On click tab event.
 *
 * @param string url
 *
 *  @returns void
 */
function getAppJournals(appPrefix, action, journalizedId)
{
  journal = $('#' + appPrefix + 'journals');

  if(journal.length == 0)
  {
    return;
  }

  if(journalizedId == undefined)
  {
    journalizedId = journal.attr('data-journalized-id');
  }
  else
  {
    journal.attr('data-journalized-id', journalizedId);
  }

	if($('#' + appPrefix + 'journals').attr('data-action-by') == '')
	{
		userId  = null;
	}
	else
	{
		userId  = $('#' + appPrefix + 'journals').attr('data-action-by');
	}

	if($('#' + appPrefix + 'journals').attr('data-only-actions') == '')
	{
		onlyActions = false;
	}
	else
	{
		onlyActions = true;
	}

	if($('#' + appPrefix + 'journals').attr('data-organization-not-null') == '')
	{
		organizationNotNull = false;
	}
	else
	{
		organizationNotNull = true;
	}

	if($('#' + appPrefix + 'journals').attr('data-two-columns') == '')
	{
		twoColumns = false;
	}
	else
	{
		twoColumns = true;
	}

	if($('#' + appPrefix + 'journal-search').isEmpty())
	{
		filter = null;
	}
	else
	{
		filter = $('#' + appPrefix + 'journal-search').val();
	}

	switch (action)
	{
		case 'firstPage':
			page = 1;
			break;
		case 'previousPage':
			page = parseInt(journal.attr('data-page')) - 1;
			break;
		case 'nextPage':
			page = parseInt(journal.attr('data-page')) + 1;
			break;
		case 'lastPage':
			page = parseInt(journal.attr('data-total-pages'));
			break;
		default:
			console.log('Something went wrong, value of action: ' + action);
			return;
	}

	$.ajax(
	{
		type: 'POST',
		data: JSON.stringify({'_token':$('#app-token').val(), 'appId': journal.attr('data-app-id'), 'page': page, 'journalizedId': journalizedId, 'filter': filter, 'userId': userId, 'onlyActions': onlyActions, 'organizationNotNull': organizationNotNull}),
		dataType : 'json',
		url: $('#app-url').val() + '/general-setup/security/journals-management/journals',
		error: function (jqXHR, textStatus, errorThrown)
		{
			$('#apps-tabs-content').children('.active').children('.breadcrumb').showAlertAfterElement('alert-danger alert-custom', textStatus, 7000);
			$('#app-loader').addClass('hidden');
			enableAll();
    },
		beforeSend:function()
		{
			$('#app-loader').removeClass('hidden');
			disabledAll();
		},
		success:function(journals)
		{
      if(journals.totalPages == 0 || journals.totalPages == 1)
      {
        $('#' + appPrefix + 'step-backward').attr('disabled', 'disabled');
        $('#' + appPrefix + 'backward').attr('disabled', 'disabled');
        $('#' + appPrefix + 'forward').attr('disabled', 'disabled');
        $('#' + appPrefix + 'step-forward').attr('disabled', 'disabled');
      }
      else if(page == 1)
			{
				$('#' + appPrefix + 'step-backward').attr('disabled', 'disabled');
				$('#' + appPrefix + 'backward').attr('disabled', 'disabled');
				$('#' + appPrefix + 'forward').removeAttr('disabled');
				$('#' + appPrefix + 'step-forward').removeAttr('disabled');
			}
			else if(page == journals.totalPages)
			{
				$('#' + appPrefix + 'step-backward').removeAttr('disabled');
				$('#' + appPrefix + 'backward').removeAttr('disabled');
				$('#' + appPrefix + 'forward').attr('disabled', 'disabled');
				$('#' + appPrefix + 'step-forward').attr('disabled', 'disabled');
			}
			else
			{
				$('#' + appPrefix + 'step-backward').removeAttr('disabled');
				$('#' + appPrefix + 'backward').removeAttr('disabled');
				$('#' + appPrefix + 'forward').removeAttr('disabled');
				$('#' + appPrefix + 'step-forward').removeAttr('disabled');
			}

			journal.attr('data-page', page);
			journal.attr('data-total-pages', journals.totalPages);

			$('#' + appPrefix + 'pager-pages-info').html(journals.pagerPagesInfo);
			$('#' + appPrefix + 'pager-records-info').html(journals.pagerRecordsInfo);
			$('#' + appPrefix + 'journal-fieldset').removeAttr('disabled');

			buildJournals(appPrefix, journals, twoColumns);

			if(filter)
			{
				$.each(filter.split(' '), function( index, value )
				{
					$('#' + appPrefix + 'journals-body').highlight(value);
				});
			}

			$('#app-loader').addClass('hidden');
			enableAll();
		}
	});
}

/**
 * Build HTML code of journals
 *
 * @param string appPrefix
 * @param array journals
 * 	An object as follows: { page: $page, totalPages: $total, records: $records, start: $start, end: $end, pageRecords: $pageRecords, pagerPagesInfo: $pagerPagesInfo, pagerRecordsInfo: $pagerRecordsInfo, journalHeaders: [{ userImageSource: $userImageSource, formattedHeader: $formattedHeader, journalDetails: [ $detail1, $detail2,… ] }
 *
 *  @returns void
 */
function buildJournals(appPrefix, journals, twoColumns)
{
  journalsHtml = '';

  journalCounter = 0;

  if(twoColumns)
  {
    journalsPerColumn = Math.round(journals.pageRecords/2);

    columnClass = 'col-lg-6 col-md-6';
  }
  else
  {
    journalsPerColumn = journals.pageRecords;

    columnClass = 'col-lg-12 col-md-12';
  }

  journalsHtml += "<div class='" + columnClass + "'>";

  $.each(journals.journalHeaders, function( index, journalHeader )
  {
	  journalCounter++;

	  journalsHtml += "<div class='journal-header clearfix'><img class='img-circle pull-left' src='" + journalHeader.userImageSource + "'></img><h5 class='journal-header-lengend pull-left'>" + journalHeader.formattedHeader + "</h5></div><ul> ";

	  $.each(journalHeader.journalDetails, function( index, journalDetail )
	  {
		  journalsHtml += '<li>' + journalDetail + '</li>';
	  });

	  journalsHtml += '</ul>';

	  if((journalCounter == journalsPerColumn) && twoColumns)
	  {
		  journalsHtml += '</div>';

		  journalsHtml += "<div class='" + columnClass + "'>";
	  }
  });

  journalsHtml += '</div>';

  $('#' + appPrefix + 'journals-body').html(journalsHtml);
}

/**
 *Clean journals
 *
 * @param string appPrefix
 *
 *  @returns void
 */
function cleanJournals(appPrefix)
{
  if($('#' + appPrefix + 'journals-body').length == 0)
  {
    return;
  }

	$('#' + appPrefix + 'journals').attr('data-journalized-id', '');
  $('#' + appPrefix + 'journals-body').html('');
  $('#' + appPrefix + 'step-backward').attr('disabled', 'disabled');
  $('#' + appPrefix + 'backward').attr('disabled', 'disabled');
  $('#' + appPrefix + 'forward').attr('disabled', 'disabled');
  $('#' + appPrefix + 'step-forward').attr('disabled', 'disabled');
  $('#' + appPrefix + 'step-backward').attr('disabled', 'disabled');
  $('#' + appPrefix + 'backward').attr('disabled', 'disabled');
  $('#' + appPrefix + 'forward').attr('disabled', 'disabled');
  $('#' + appPrefix + 'journal-search').val('');
  $('#' + appPrefix + 'journal-fieldset').attr('disabled', 'disabled');
  $('#' + appPrefix + 'pager-pages-info').html($('#' + appPrefix + 'journals').attr('data-pager-pages-info'));
  $('#' + appPrefix + 'pager-records-info').html($('#' + appPrefix + 'journals').attr('data-pager-records-info'));
}

/**
 * Handle server exceptions
 *
 * @param object jqXHR
 * @param string id
 *
 *  @returns void
 */
function handleServerExceptions(jqXHR, id, alertAsFirstChild)
{
	alertAsFirstChild = (alertAsFirstChild == undefined ? true : alertAsFirstChild);

	try
	{
		response = JSON.parse(jqXHR.responseText);
		response = response.error.type;
	}
	catch (e)
	{
		response = $.trim(jqXHR.responseText);
	}

	switch (response)
	{
		case 'Illuminate\\Session\\TokenMismatchException':
			alert(lang.tokenMismatchException);
			window.location.reload();
			return;
			break;
		// case 'Kwaai\\Security\\Exceptions\\AuthenticationException':
		case 'Unauthorized.':
			alert(lang.authenticationException);
			window.location.reload();
			return;
			break;
		default:
			if(alertAsFirstChild)
			{
				$('#' + id).showAlertAsFirstChild('alert-danger', lang.defaultErrorMessage, 7000);
			}
			else
			{
				$('#' + id).showAlertAfterElement('alert-danger alert-custom', lang.defaultErrorMessage, 7000);
			}

	}

	$('#app-loader').addClass('hidden');
	enableAll();
}

/**
 * Close user apps popover
 *
 * @returns void
 */
$.fn.closeUserAppsPopover = function()
{
	$('#user-apps-title').popover('hide');
};

/**
 * Close organizations menu popover
 *
 * @returns void
 */
$.fn.closeOrganizationsPopover = function()
{
	$('#user-organizations-dropdown-menu').popover('hide');
};

/**
 * Close current organization label popover
 *
 * @returns void
 */
$.fn.closeCurrentOrganizationPopover = function()
{
	$('#apps-tabs-content').children('.active').children('.breadcrumb-organization-name').popover('hide');
};

/**
 * Close search action input popover
 *
 * @returns void
 */
$.fn.closeSearchActionPopover = function()
{
	$('#search-action-container').popover('hide');
};

/**
 * Close gravatar popover
 *
 * @returns void
 */
$.fn.closeGravatarPopover = function()
{
	$('#user-gravatar').popover('hide');
};

/**
 * Close dropdown menu popover
 *
 * @returns void
 */
$.fn.closeDropdownMenuPopover = function()
{
	$('#user-dropdown-menu').popover('hide');
};

$(document).ready(function()
{
	$.ajaxSetup({
	  headers: {
	      'X-CSRF-TOKEN': $('#app-token').val()
	  }
	});

	if (navigator.userAgent.match(/IEMobile\/10\.0/))
	{
		var msViewportStyle = document.createElement("style");
		msViewportStyle.appendChild(
				document.createTextNode(
			    "@-ms-viewport{width:auto!important}"
	    )
	  );
	  document.getElementsByTagName("head")[0].appendChild(msViewportStyle);
	}

	History = window.History;

	History.Adapter.bind(window,'statechange',function(){
		var State = History.getState();
		loadPage(State.url.replace($('#app-url').val(), ''));
	});


	$.widget( "custom.categoryautocomplete", $.ui.autocomplete, {
		_renderMenu: function( ul, items ) {
			var that = this,
			currentCategory = "";
			$.each( items, function( index, item ) {
				if ( item.category != currentCategory ) {
					ul.append( "<li class='ui-autocomplete-category'>" + item.category + "</li>" );
					currentCategory = item.category;
				}
		        that._renderItemData( ul, item );
			});
		}
	});

	windowWidth = document.documentElement.clientWidth;
	windowHeight = document.documentElement.clientHeight;
	var ajaxHeight = 45;
	var ajaxWidth = 154;

	$("#app-loader").css({
		"top": windowHeight/2-ajaxHeight/2,
		"left": windowWidth/2-ajaxWidth/2
	});

	$('#user-organizations-modal').on('shown.bs.modal', function (e) {
		$('#change-to-organization-name').focus();
	});

	$('#change-to-organization-form').jqMgVal('addFormFieldsValidations');

  $('#page-container').attr('data-current-page-width', $('#page-container').width());

  $(window).bind('resize', function()
  {
	  if(($('#page-container').attr('data-current-page-width') >= 1140 && $('#page-container').width() <= 940) || ($('#page-container').attr('data-current-page-width') < 1140 && $('#page-container').width() > 940))
	  {
        $('#page-container').attr('data-current-page-width', $('#page-container').width());
        $('.app-multiselect').multiselect('destroy');
        $('.app-multiselect').multiselect();

        if($('#page-container').width() <= 940)
        {
          width = 908;
          $('#up-c-journals,#up-a-journals').attr('data-two-columns', true);
        }
        else
        {
          width = 1106;
          $('#up-c-journals,#up-a-journals').attr('data-two-columns', '');
        }

        cleanJournals('up-c-');
        cleanJournals('up-a-');
        getAppJournals('up-c-','firstPage');
        getAppJournals('up-a-','firstPage');

        $.each($('.app-grid'), function( index, element )
        {
          $('#' + $(element).attr('data-app-grid-id')).setGridWidth(width);
        });

				$.each($('.custom-app-grid'), function( index, element )
        {
          $('#' + $(element).attr('data-app-grid-id')).setGridWidth($(this).width());
        });
	  }
  });

  $(window).scroll(function () {
	  if ($(this).scrollTop() != 0)
	  {
		  $('#back-to-top').fadeIn();
	  }
	  else
	  {
		  $('#back-to-top').fadeOut();
	  }
  });

	$('#apps-tabs a:last').tab('show');

	$('.breadcrumb').localScroll();

	$('.navbar-nav').localScroll();

	$('#user-apps-content').buildUserApps(userApps);

	setCurrentApp();

	$('.base-popover').popover();

	$('.breadcrumb-organization-name').on('shown.bs.popover', function ()
	{
    //Mostrar pantalla bloqueada
	});

	$('.breadcrumb-organization-name').on('hidden.bs.popover', function ()
	{
    window.scrollTo(0, $('#user-apps-title').offset().top);
		$('#user-apps-title').popover('show');
		$('#user-apps-container').effect('highlight', null, 1500);
	});

	$('#user-apps-title').on('hidden.bs.popover', function ()
	{
		window.scrollTo(0, 0);
		$('#search-action-container').popover('show');
	});

	$('#search-action-container').on('hidden.bs.popover', function ()
	{
		$('#user-gravatar').popover('show');
	});

	$('#user-gravatar').on('hidden.bs.popover', function ()
	{
		$('#user-gravatar').parent().click();
		$('#user-dropdown-menu').popover('show');
	});

	$('#user-dropdown-menu').on('hidden.bs.popover', function ()
	{
		if($('#user-organizations-dropdown-menu').find('ul').children().length > 0)
		{
			$('#user-organizations-dropdown-menu').popover('show');
		}

		//Desbloquear pantalla

		changePopoverStatus(true, false);
	});

	$('#user-organizations-dropdown-menu').on('shown.bs.popover', function ()
	{
		$('.popup-preference-link').click(function()
		{
			$('#user-preferences-top-bar-menu').click();
		});
	});

	$('#user-organizations-dropdown-menu').on('hidden.bs.popover', function ()
	{
		changePopoverStatus(true, true);
	});

	$('#user-apps-content').on('hidden.bs.collapse', function ()
	{
		$(this).parent().children('.panel-heading').children('.btn-dashboard-toggle').children('i').attr('class','fa fa-chevron-down');
	});

	$('#user-apps-content').on('shown.bs.collapse', function ()
	{
		$(this).parent().children('.panel-heading').children('.btn-dashboard-toggle').children('i').attr('class','fa fa-chevron-up');
	});

	$('#dashboard-top-bar-menu').click(function()
	{
		loadPage('/');
		$('#user-apps-content').hideModulesApps();
	});

	$('#user-preferences-top-bar-menu').click(function()
	{
		loadPage('/' + $(this).attr('data-preferences-url'));
		$('#user-apps-content').hideModulesApps();
	});

	$('#user-apps-top-bar-menu').click(function()
	{
		$('#user-apps-container').effect('highlight', null, 1500);
	});

	$('#back-to-top').click(function()
	{
		$('#top-navbar-menu').click();
	});

	$('#search-action').focusout(function()
	{
		$(this).val('');
	});

	$('#search-action').on('autocompleteselect', function( event, ui )
	{
		if(ui.item.actionButtonId != '')
		{
			$('#' + ui.item.actionButtonId).click();
		}
		else
		{
			setApp(ui.item.value);
		}
	});

	$('#change-to-organization').click(function()
	{
		if(!$('#change-to-organization-form').jqMgVal('isFormValid'))
		{
			return;
		}

		changeLoggedUserOrganization($('#change-to-organization-id').val());
	});

});
