/* multitrigger.js (c) 2012 by Christian Mayer [CometVisu at ChristianMayer dot de]
 *
 * This program is free software; you can redistribute it and/or modify it
 * under the terms of the GNU General Public License as published by the Free
 * Software Foundation; either version 3 of the License, or (at your option)
 * any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
 * FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for
 * more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 59 Temple Place - Suite 330, Boston, MA  02111-1307, USA
 */

define( ['_common'], function( design ) {
   var basicdesign = design.basicdesign;
 
design.basicdesign.addCreator('multitrigger', {
  create: function( element, path, flavour, type ) {
    var $e = $(element);
    
    // create the main structure
    var showstatus = $e.attr('showstatus') === 'true',
        ret_val    = basicdesign.createDefaultWidget( 'multitrigger', $e, path, flavour, type, showstatus ? this.update : undefined );
    // and fill in widget specific data
    var data = templateEngine.widgetDataInsert( path, {
      showstatus  : showstatus,
      button1label: $e.attr('button1label'),
      button1value: $e.attr('button1value'),
      button2label: $e.attr('button2label'),
      button2value: $e.attr('button2value'),
      button3label: $e.attr('button3label'),
      button3value: $e.attr('button3value'),
      button4label: $e.attr('button4label'),
      button4value: $e.attr('button4value')
    } );
    
    // create the actor
    var buttons = $('<div class="actor_container" style="float:left"/>');
    var buttonCount = 0;
    
    if( data.button1label )
    {
      var actor = '<div class="actor switchUnpressed ';
      if( data.align ) 
        actor += data.align; 
      actor += '">';
      
      actor += '<div class="value">' + data.button1label + '</div>';
      actor += '</div>';
      var $actor = $(actor).bind( 'click', this.action );
      buttons.append( $actor );
      if( 1 == (buttonCount++ % 2) ) buttons.append( $('<br/>') );
    }
    
    if( data.button2label )
    {
      var actor = '<div class="actor switchUnpressed ';
      if( data.align ) 
        actor += data.align; 
      actor += '">';
      
      actor += '<div class="value">' + data.button2label + '</div>';
      actor += '</div>';
      var $actor = $(actor).bind( 'click', this.action );
      buttons.append( $actor );
      if( 1 == (buttonCount++ % 2) ) buttons.append( $('<br/>') );
    }
    
    if( data.button3label )
    {
      var actor = '<div class="actor switchUnpressed ';
      if( data.align ) 
        actor += data.align; 
      actor += '">';
      
      actor += '<div class="value">' + data.button3label + '</div>';
      actor += '</div>';
      var $actor = $(actor).bind( 'click', this.action );
      buttons.append( $actor );
      if( 1 == (buttonCount++ % 2) ) buttons.append( $('<br/>') );
    }
    
    if( data.button4label )
    {
      var actor = '<div class="actor switchUnpressed ';
      if( data.align ) 
        actor += data.align; 
      actor += '">';
      
      actor += '<div class="value">' + data.button4label + '</div>';
      actor += '</div>';
      var $actor = $(actor).bind( 'click', this.action );
      buttons.append( $actor );
      if( 1 == (buttonCount++ % 2) ) buttons.append( $('<br/>') );
    }
    
    return ret_val.append( buttons );
  },
  update: function(e,d) { 
    var element = $(this),
        data  = templateEngine.widgetDataGetByElement( this ),
        thisTransform = data.address[ e.type ][0],
        value = templateEngine.transformDecode( thisTransform, d );
        
    element.find('.actor').each( function(){
      var $this     = $(this),
          index = $this.index() < 3 ? $this.index()+1 : $this.index(),
          isPressed = value === data['button'+index+'value'];
      $this.removeClass( isPressed ? 'switchUnpressed' : 'switchPressed' )
           .addClass(    isPressed ? 'switchPressed' : 'switchUnpressed' );
    });
  },
  action: function() {
    var $this = $(this),
        data  = templateEngine.widgetDataGetByElement( $this.parent() ),
        index = $this.index() < 3 ? $this.index()+1 : $this.index(),
        value = data['button'+index+'value'];
    for( var addr in data.address )
    {
      if( !(data.address[addr][1] & 2) ) continue; // skip when write flag not set
      templateEngine.visu.write( addr.substr(1), templateEngine.transformEncode( data.address[addr][0], value ) );
    }
  }
});

}); // end define