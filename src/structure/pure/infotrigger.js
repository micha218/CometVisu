/* infotrigger.js (c) 2012 by Christian Mayer [CometVisu at ChristianMayer dot de]
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
 
design.basicdesign.addCreator('infotrigger', {
  create: function( element, path, flavour, type ) {
    var $e = $(element);

    // create the main structure
    var makeAddressListFn = function( src, transform, mode, variant ) {
      // Bit 0 = short, Bit 1 = button => 1|2 = 3 = short + button
      return [ true, variant == 'short' ? 1 : (variant == 'button' ? 2 : 1|2) ];
    }
    var ret_val = basicdesign.createDefaultWidget( 'infotrigger', $e, path, flavour, type, this.update, makeAddressListFn );
    // and fill in widget specific data
    var data = templateEngine.widgetDataInsert( path, {
      'downvalue'     : $e.attr('downvalue' )            || 0,
      'shortdownvalue': $e.attr('shortdownvalue')        || 0,
      'downlabel'     : $e.attr('downlabel')                 ,
      'upvalue'       : $e.attr('upvalue' )              || 0,
      'shortupvalue'  : $e.attr('shortupvalue')          || 0,
      'uplabel'       : $e.attr('uplabel')                   ,
      'shorttime'     : parseFloat($e.attr('shorttime')) || -1,
      'isAbsolute'    : ($e.attr('change')               || 'relative') == 'absolute',
      'min'           : parseFloat($e.attr('min'))       || 0,
      'max'           : parseFloat($e.attr('max'))       || 255,
    } );

    // create buttons + info
    var buttons = $('<div style="float:left;"/>');

    var actordown = '<div class="actor switchUnpressed downlabel" ';
    if ( data.align ) 
      actordown += 'style="text-align: ' + data.align + '" '; 
    actordown += '>';
    actordown += '<div class="label">' + (data.downlabel || '-') + '</div>';
    actordown += '</div>';
    var $actordown = $(actordown);
    basicdesign.createDefaultButtonAction( $actordown, $actordown, this.downaction, this.action );

    var actorup = '<div class="actor switchUnpressed uplabel" ';
    if ( data.align ) 
      actorup += 'style="text-align: ' + data.align + '" '; 
    actorup += '>';
    actorup += '<div class="label">' + (data.uplabel || '+') + '</div>';
    actorup += '</div>';
    var $actorup = $(actorup);
    basicdesign.createDefaultButtonAction( $actorup, $actorup, this.downaction, this.action );

    var actorinfo = '<div class="actor switchInvisible " ';
    if ( data.align ) 
      actorinfo += 'style="text-align: ' + data.align + '" '; 
    actorinfo += '" ><div class="value"></div></div>';
    var $actorinfo = $(actorinfo);

    switch ($e.attr('infoposition')) {
      case 'middle':
        buttons.append( $actordown );
        buttons.append( $actorinfo );
        buttons.append( $actorup );        
        break;
      case 'right':
        buttons.append( $actordown );
        buttons.append( $actorup );        
        buttons.append( $actorinfo );
        break;
      default:
        buttons.append( $actorinfo );
        buttons.append( $actordown );
        buttons.append( $actorup );        
        break;
    }

    ret_val.append( buttons );

    // initially setting a value
    basicdesign.defaultUpdate( undefined, undefined, ret_val, true, path );

    return ret_val;
  },

  update: function(e,d) { 
    var element = $(this);
    var value = basicdesign.defaultUpdate( e, d, element, true, element.parent().attr('id') );
  },
  downaction: function(event) {
     templateEngine.widgetDataGetByElement( $(this).parent() )['downtime'] = new Date().getTime();
  },
  action: function(event) {
    var $this      = $(this),
        isDown     = $this.hasClass('downlabel'),
        data       = templateEngine.widgetDataGetByElement( $this.parent() ),
        buttonDataValue      = data[ isDown ? 'downvalue'      : 'upvalue'      ],
        buttonDataShortvalue = data[ isDown ? 'shortdownvalue' : 'shortupvalue' ];
    if( data.downtime )
    {
      var isShort = (new Date().getTime()) - data.downtime < data.shorttime;
      var value = isShort ? buttonDataShortvalue : buttonDataValue;
      if( data.isAbsolute )
      {
        value = parseFloat(data.basicvalue);
        if( isNaN( value ) )
          value = 0; // anything is better than NaN...
        value = value + parseFloat(isShort ? buttonDataShortvalue : buttonDataValue);
        if (value < data.min ) value = data.min;
        if( value > data.max ) value = data.max;
      }
      var bitMask = (isShort ? 1 : 2);
      for( var addr in data.address )
      {
        if( !(data.address[addr][1] & 2) ) continue; // skip when write flag not set
        if (data.address[addr][2] & bitMask) {
          templateEngine.visu.write( addr.substr(1), templateEngine.transformEncode( data.address[addr][0], value ) );
        }
      }
    }
  }
});

}); // end define