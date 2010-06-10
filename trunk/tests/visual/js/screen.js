$(function(){
	$('#enhanceMsg').text('Enhanced (screen)');
	
	//mobile toggle link
	if(enhance.cookiesSupported){
		$('<a href="#" class="mobiledesktoptoggle">View handheld version</a>')
			.click(function(){
				enhance.toggleMedia('screen', 'screen and (max-device-width: 480px)');
			})
			.appendTo('body');
			
		$('.mobiledesktoptoggle, .enhanced_toggleResult').wrapAll('<div id="toggleContain"></div>');		
	}
});