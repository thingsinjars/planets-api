Planets
===

REST API to calculate the current direction of the planets (and the moon) from a given location.

> NOTE: This is several years old and not very well put together. There are probably other projects that do this better now.

Endpoints
---

/visible/:latitude/:longitude

Returns an array of planet objects containing only planets that are currently visible. Visibility is defined as:

 * magnitude < -5 if altitude of the sun > -6°
 * magnitude < 6 if altitude of the sun <= -6°

Legal
---

Contains AstroTools by Ole Nielsen which is licensed as GNU General Public Licence (GNU GPL).

Any code provided by Peter Hayes Javascript Ephemeris is copyright © Peter Hayes 1999-2001.

You're free to do whatever you like with the small amount I wrote as long as the above licences are upheld.