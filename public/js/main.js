$(document).ready(function( ){
  $('.hamburger').click(function(e){
    e.preventDefault( );
    $('#menu').toggleClass('hamburger-menu').slideToggle('slow');
  }); 
  if($('#ck-editor').length){
 	CKEDITOR.replace( 'ck-editor' );
 }

 if($('.avatar-img').length){
 	$('.avatar-img').click(function(e){
 		$('.selected').removeClass('selected');
 		$(this).addClass('selected');
 		var selected = $(this).attr('data-avatar');
 		$('.avatar-input').val(selected);
 	});
 }
});