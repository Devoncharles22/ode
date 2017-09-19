$(document).ready(function( ){
  $('.hamburger').click(function(e){
    e.preventDefault( );
    $('#menu').toggleClass('hamburger-menu').slideToggle('slow');
  }); 
  if($('#ck-editor').length){
 	CKEDITOR.replace( 'ck-editor' );
 }
});