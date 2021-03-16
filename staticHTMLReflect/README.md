# Static HTML Reflect

This is a utility -- not a project :/

Reflects the body given in the URL hash (assumes is passed through `encodeURIComponent`).

Input html body:

<input oninput="document.getElementById('output').innerText = document.getElementById('output').href = location.href.slice(0, location.href.lastIndexOf('/')) + '/#' + encodeURIComponent(this.value)">

<a href="#" id="output"></a>
