// ==UserScript==
// @name		DMM Plus SC
// @namespace	bluelovers
// @author		bluelovers
//
// @downloadURL	https://gist.github.com/bluelovers/d7b2d9f51030a90a871f/raw/DMM_Plus_SC.user.js
// @updateURL	https://gist.github.com/bluelovers/d7b2d9f51030a90a871f/raw/DMM_Plus_SC.user.js
//
// @include		http://www.dmm.co*/netgame/social/application/-/list/*
// @include		https://www.dmm.co*/my/*
// @include		http://www.dmm.co*/netgame/
// @include		http://www.dmm.co*/netgame/social/profile/
// @include		http://www.dmm.co*/netgame/profile/-/regist/*
// @include		http://www.dmm.co*/netgame/social/-/regist/*
// @include		http://www.dmm.co*/netgame/social/-/gadgets/*
// @include		http://www.dmm.co*/top/-/error/area/*
// @include		https://www.dmm.co*/service/-/exchange/*
// @include		http*://www.dmm.co*/netgame_s/*
// @include		http*://www.dmm.co*/netgame/feature/*
//
//
// @version	 1
// @grant	 none
// run-at	 document-start
// @run-at	 document-end
//
// @require	 http://code.jquery.com/jquery-latest.js?KU201
// @require	 https://github.com/bluelovers/UserScript-Framework/raw/develop/UserScript_Framework.user.js?KU201
//
// ==/UserScript==
(function($, undefined){

	$.migrateTrace = false;

	var _doc = $(document);
	var _event_ready_load = 'ready.load';
	var _timer_ready_load;

$(function(){

	var _flag;

	if (_flag = window.location.pathname.match(/en\/.*\/(?:login|regist)/))
	{
		_doc
			.on(_event_ready_load, function(){
				if ($('ul.hd-lang').size())
				{
					var _count = 0;

					var _func = function () {
						if ($('.hd-lang .ja a:first').size())
						{
							$('.hd-lang .ja a:first')
								.each(function(){
									var _that = this;

									_that.click();

									$(_that).trigger('click');

									var _href = this.href;

									window.location.href = _href;
								})
							;
						}
						else if (_count <= 10)
						{
							_count++;

							setTimeout(_func, 100);
						}
					};

					_func();
				}
			})
		;
	}

	if (window.location.pathname.match(/exchange|error|regist|login|netgame_s|list/))
	{
		dmm_area_cookies();

//		UF.log(document.cookie);
	}

	if (window.location.pathname.match(/gadgets/))
	{
		document.title = document.title
			.replace(' - オンラインゲーム - DMM.com', '')
			.replace(' - オンラインゲーム - DMM.R18', '')
		;
	}

	var _ufdata = {
		'img_001': 'data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2210%22%20height%3D%2210%22%3E%3Cg%20transform%3D%22translate%28-826.429%20-698.791%29%22%3E%3Crect%20width%3D%225.982%22%20height%3D%225.982%22%20x%3D%22826.929%22%20y%3D%22702.309%22%20fill%3D%22%23fff%22%20stroke%3D%22%2306c%22%2F%3E%3Cg%3E%3Cpath%20d%3D%22M831.194%20698.791h5.234v5.391l-1.571%201.545-1.31-1.31-2.725%202.725-2.689-2.689%202.808-2.808-1.311-1.311z%22%20fill%3D%22%2306f%22%2F%3E%3Cpath%20d%3D%22M835.424%20699.795l.022%204.885-1.817-1.817-2.881%202.881-1.228-1.228%202.881-2.881-1.851-1.851z%22%20fill%3D%22%23fff%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E',
	};

	UF.addStyle([

		'@media only screen and (max-width: 1100px) { #main-ntg { text-align: left; padding-left: 15px; } }',
		'@media only screen and (max-width: 1000px) { #main-ntg { text-align: left; padding-left: 0px; } }',

		'span.img_001, a.img_001 { display: inline-block; line-height: 19px; float: right; width: auto; height: auto;  }',
		'img.img_001, #contents-ntg .ntg-item-pclist li a img.img_001 { padding: 1px 5px; width: auto; height: auto; display: inline-block; vertical-align: text-top; border: 0px solid #DEE2EF; }',

		'#page-popup { display: none !important; }',

		'#dmm-ntgnavi-renew { margin-bottom: 10px; margin: 0px 0px 10px; }',

		'body { margin: 0px; }',

		'iframe { border: 0px none; }',

		'#main-ntg { margin: 0px; }',

	]);

	if (window.location.pathname.match(/netgame_s/))
	{
		_doc
			.on(_event_ready_load, function () {
				$(':checkbox[name=notification]').attr('checked', false).prop('checked', false).trigger('change');
			})
		;
	}

	if (window.location.pathname.match(/login/))
	{
		_doc
			.on(_event_ready_load, function () {
				$(':input').filter('#save_login_id, #save_password, #use_auto_login').attr('checked', true).prop('checked', true).trigger('change');

				$(':input').filter('[name=save_login_id], [name=save_password], [name=use_auto_login]').val(1);
			})
		;
	}

	$('#opt_mail_mag').attr('checked', false).prop('checked', false);

	if ($('#s2').size())
	{
		$('#s2').attr('checked', true).prop('checked', true);

		$('select#year')
			.find('option[value="' + 1984 + '"]')
				.attr('selected', true).prop('selected', true)
			.parent(':first')
				.val(1984)
		;

		$('select#month')
			.find('option[value="' + 10 + '"]')
				.attr('selected', true).prop('selected', true)
			.parent(':first')
				.val(10)
		;

		$('select#day')
			.find('option[value="' + 25 + '"]')
				.attr('selected', true).prop('selected', true)
			.parent(':first')
				.val(25)
		;
	}

	$(window)
		.on('load.recommend resize.recommend', function(){
			setTimeout(function () {
				$('#ntg-recommend').addClass('hide');
			}, 500);
		})
		.triggerHandler('load.recommend')
	;

	if ($('#game_frame').size())
	{
		$('body').css('min-width', $('#game_frame').width());
	}

	if ($('.box-profile:first').text())
	{
		var userName = $('.box-profile:first').text()
			.replace(/[\'\"\n \r\s\t]+/ig, '')
			.replace(/さん$/ig, '')
		;

		var username = '';

		if (unsafeWindow.dataLayer)
		{
			$.each(unsafeWindow.dataLayer || [], function(indexInArray, value){
				if (value && value.dtm)
				{
					username += value.dtm.userId;

					return false;
				}
			});
		}

		username = (userName + username).replace(/[\'\"\n \r\s\t]+/ig, '');

//		UF.log('userId', username, unsafeWindow.dataLayer);

		dmm_area_cookies();

		$('#contents-ntg .d-item.ntg-item-pclist li:not([data-done])')
			/*
			.one('click mousedown', function(){
				dmm_area_cookies();
			})
			*/
			.each(function(){
				var _this = $(this);

				_this
					.attr('data-done', true)
				;

				var _a = $('> a:eq(0)', _this);

				var _href = _a.attr('href');
				var _onclick = _a.attr('onclick');

				if (!_href || _href.match(/^\s*javascript/i))
				{
					_href = $('input:eq(0)', _a).val();
				}

				if (!_href || _href.match(/^\s*javascript/i))
				{
					return true;
				}

				var _gamename = $('.tx-ttl', _a).text();

				(function(title, username) {
					_a
						.attr('onclick', 'return false;')
						.attr('href', _href)
						.attr('title', title)
						.on('click', function(event){
							try
							{
								var _w = window.open(_href
									, (title + username).replace(/[\'\"\n \r\s\t]+/ig, '')
									, 'width=1080,height=720,toolbar=no,scrollbars=yes,menubar=no,resizable=yes,status=no,fullscreen=no'
								);

								UF.doneEvent(event);

								setTitle(_w, title);

								_w.focus();

//								UF.log(_w, title, username);
							}
							catch (e)
							{
								UF.log(e);
							}

							return false;
						})
					;
				})(_gamename, username);

				/*
				_a
					.attr('onclick', 'window.open(\'' + _a.attr('href') + '\', \'' + ($('.tx-ttl', _a).text() + $('.box-profile:first').text()).replace(/[\'\"\n \r\s\t]+/ig, '') + '\', \'width=1080,height=720,toolbar=no,scrollbars=no,menubar=no\'); return false;')
				;
				*/
			})
		;

	}

	_doc
		.add(window)
		.on('load.ready', function(){
			_timer_ready_load && clearTimeout(_timer_ready_load);

			_timer_ready_load = setTimeout(function(){
				_doc.trigger(_event_ready_load);
			}, 500);
		})
		.ready(function(){
			_timer_ready_load && clearTimeout(_timer_ready_load);

			_timer_ready_load = setTimeout(function(){
				_doc.trigger(_event_ready_load);
			}, 500);
		})
	;

	function dmm_area_cookies()
	{
		if (dmm_area_cookies.done)
		{
			return true;
		}

//		document.cookie = "ckcy=1;expires=Sun, 09 Feb 2019 09:00:09 GMT;domain=osapi.dmm.com;path=/";
//		document.cookie = "ckcy=1;expires=Sun, 09 Feb 2019 09:00:09 GMT;domain=203.104.209.7;path=/";
//		document.cookie = "ckcy=1;expires=Sun, 09 Feb 2019 09:00:09 GMT;domain=www.dmm.com;path=/netgame/";
//		document.cookie = "ckcy=1;expires=Sun, 09 Feb 2019 09:00:09 GMT;domain=log-netgame.dmm.com;path=/";
//
//		document.cookie = "ckcy=1;expires=Sun, 09 Feb 2019 09:00:09 GMT;domain=.dmm.com;path=/netgame/";
//		document.cookie = "ckcy=1;expires=Sun, 09 Feb 2019 09:00:09 GMT;domain=.dmm.com;path=/";
//		document.cookie = "ckcy=1;expires=Sun, 09 Feb 2019 09:00:09 GMT;domain=www.dmm.com;path=/";
//		document.cookie = "ckcy=1;expires=Sun, 09 Feb 2019 09:00:09 GMT;domain=display.dmm.com;path=/";

//		var _expires = 'Sun, 09 Feb 2019 09:00:09 GMT';

		var days = 365;

		var date = new Date();
		date.setTime(date.getTime()+(days * 24 * 60 * 60 * 1000));
		var _expires = date.toGMTString();

		_expires = ';expires=' + _expires;

		var _domain_list = [
			'203.104.209.7',

			'www.dmm.com',
			'osapi.dmm.com',
			'log-netgame.dmm.com',
			'.dmm.com',
			'display.dmm.com',

			'www.dmm.co.jp',
			'osapi.dmm.co.jp',
			'log-netgame.dmm.co.jp',
			'.dmm.co.jp',
			'display.dmm.co.jp',

			'sp.dmm.co.jp',
			'sp.dmm.com',
		];

		var _data_list = {
			ckcy: 1,
			cklg: 'ja',

			'check_done_login': 1,
			'check_open_login': 1,

			'foreign_service_list': 1,

		};

		var _path_list = [
			'/netgame/',
			'/',
			'/gadgets/',
		];

		var _log = [];

		for (var _domain in _domain_list)
		{
			for (var _data in _data_list)
			{
				for (var _path in _path_list)
				{

					document.cookie = _data + '=' + '' + ';expires=Thu, 01 Jan 1970 00:00:01 GMT' + ';domain=' + _domain_list[_domain] + ';path=' + _path_list[_path];
//					document.cookie = _data + '=' + _data_list[_data] + _expires + ';domain=' + _domain_list[_domain] + ';path=' + _path_list[_path];

					var _cookies = _data + '=' + _data_list[_data] + _expires + ';domain=' + _domain_list[_domain] + ';path=' + _path_list[_path];

					document.cookie = _cookies;

//					_log.push(_cookies);
				}
			}
		}

//		UF.log(_log);

//		document.cookie = "ckcy=1;expires=Sun, 09 Feb 2019 09:00:09 GMT;domain=log-netgame.dmm.co.jp;path=/";
//		document.cookie = "ckcy=1;expires=Sun, 09 Feb 2019 09:00:09 GMT;domain=osapi.dmm.co.jp;path=/";
//		document.cookie = "ckcy=1;expires=Sun, 09 Feb 2019 09:00:09 GMT;domain=www.dmm.com;path=/";
//		document.cookie = "ckcy=1;expires=Sun, 09 Feb 2019 09:00:09 GMT;domain=www.dmm.co.jp;path=/";
//		document.cookie = "ckcy=1;expires=Sun, 09 Feb 2019 09:00:09 GMT;domain=www.dmm.co.jp;path=/netgame/";

		dmm_area_cookies.done = true;

//		UF.log(dmm_area_cookies);
	}

	function setTitle(target, title, delay, max, min){
		var delay = delay || 500;
		var max = max || 20;
		var min = min || 10;

		var i = 1;
		var timer;

//		UF.log(target, title, delay, max, min);

		setTimeout(function(){

		timer = window.setInterval(function(){

			try
			{
//				UF.log('setTitle', target, target.closed);

				if (target && target.closed)
				{
					i = -100;
				}

				if (target && target.document && (target.document.readyState == 'complete' || target.document.readyState == 'interactive'))
				{
					UF.log('setTitle', target, target.document, target.document.readyState);

					target.document.title = title;

					if (i > min && (target.document.readyState == 'complete'))
					{
						i = -100;
					}
				}
			}
			catch (e)
			{
				i = -100;

				UF.log(e, target);
			}

//			UF.log('setTitle', i, timer, target, title, delay, max, min);

			if ((i <= 0) || ((i >= max) && (i > min)))
			{
				try
				{
					target.document.title = title;
				}
				catch (e)
				{
					UF.log(e);
				}

				window.clearInterval(timer);

				timer = null;
			}

			i++;
		}, delay);

		}, 0);
	}

})})(jQuery.noConflict());
