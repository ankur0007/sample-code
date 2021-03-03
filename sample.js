jQuery(function($) {
 
    window.AVCL = {};
 
    AVCL.init = function() {
        AVCL.cacheSelectors();
        AVCL.onLoadEventHandler();
        AVCL.eventHandler();

    }
 
    AVCL.cacheSelectors = function() {
        // Initialize variables and use in whole script
        AVCL.body = $('#avcl_settings');
        AVCL.active = 'active';
        AVCL.hidden = 'hidden';
        AVCL.licence_field = $('.licence_field').find('input');
        AVCL.licence_notice_img = $('.licence_field').find('img');
        AVCL.licence_field = $('.licence_field').find('input');
        AVCL.notice = AVCL.body.find('.notice');
        AVCL.tours_nav = AVCL.body.find('#my_tours');
        AVCL.tours_panel = AVCL.body.find('.my_tours');
        AVCL.activate_btn = AVCL.body.find('.activate_avcl');
        AVCL.wait_btn = AVCL.body.find('.activate_avcl').next();
        AVCL.oavcl_verified = AVCL.body.find('.oavcl_verified');
 
    }
 	
 	AVCL.onLoadEventHandler = function() {
 		
 		loadDefaultTrigger();
 	}
    
    AVCL.eventHandler = function() {
 		AVCL.body.on( 'click', '.clear', hideNotice );
        AVCL.body.on( 'click', '.activate_avcl', validateActivation );
 
    }

    var loadDefaultTrigger = function( e ){
    	 
    	
    	var key = AVCL.licence_field.val();
    	var default_tab = 1;
    	if(key.length > 0){
    		AVCL.tours_nav.removeClass('hidden');
 			AVCL.tours_panel.removeClass('hidden');
 			default_tab = 0;
 			getAllTours();

    	}
    	
    	AVCL.body.tabs({ active : default_tab });
    };

    var getAllTours = function( e ){
    	var params = {
    		'action' : 'get_all_tours',
    		'nonce'	 : avclJSObject.nonce

    	};
    	$.post(avclJSObject.ajaxurl, params, function(res){
    		AVCL.tours_panel.html(res);
    		AVCL.tours_panel.find('table').DataTable({
    			///"order": [[ 2, "asc" ]]
    		});
    	});
    };

    var hideNotice = function( e ) {
    	AVCL.notice.fadeOut('slow');
    };
    
    var validateActivation = function( e ) {
	    e.preventDefault();

	    var key = AVCL.licence_field.val();
	    if(key.length <= 0){
	    	AVCL.licence_field.focus().css('border','1px solid red');
	    	AVCL.licence_notice_img.removeClass('hidden');
 			AVCL.notice.removeClass('hidden');
	    	 return false;
	    }

	   	avclActivation();
		};
    
 	var avclActivation = function(){
 		AVCL.licence_field.css('border','');
 		AVCL.activate_btn.addClass('hidden');
 		AVCL.wait_btn.removeClass('hidden');


 		 var key = AVCL.licence_field.val();
 		var params = {
 			'action' : 'avcl_activation',
 			'key'	 : key,
 			'nonce'	 : avclJSObject.nonce
 		};
 		$.post(avclJSObject.ajaxurl, params, function(res){
 			var obj = JSON.parse(res);
 				AVCL.activate_btn.removeClass('hidden');
 				AVCL.wait_btn.addClass('hidden');
 			if(obj.success){
 				AVCL.licence_notice_img.addClass('hidden');
 				AVCL.oavcl_verified.removeClass('hidden');
 				AVCL.notice.addClass('hidden');
 				getAllTours();
 				setTimeout(function(){ 
 					AVCL.tours_nav.removeClass('hidden');
 					AVCL.tours_panel.removeClass('hidden');
 					AVCL.tours_nav.find('a').click();
 					
 				 }, 1000);
 			}else{
 				AVCL.licence_notice_img.removeClass('hidden');
 				AVCL.oavcl_verified.addClass('hidden');
 				AVCL.notice.removeClass('hidden');
 			}
 		});
 	}

    AVCL.init();
 
});
