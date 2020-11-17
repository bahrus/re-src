# re-src

<a href="https://nodei.co/npm/re-src/"><img src="https://nodei.co/npm/re-src.png"></a>

<img src="https://badgen.net/bundlephobia/minzip/re-src">

The hyperlink tag supports a target attribute, which causes an iframe to load the content of the url.  However, this doesn't update the address bar, so it is difficult to bookmark or email this "state".

```html
<nav>
    <a href="a.html" target="myIFrame">A</a>
    <br>
    <a href="b.html" target="myIFrame">B</a>

</nav>
<iframe name="myIFrame"></iframe>
```

Suggested syntax:

https://mydomain.com/contextPath/myResource#:-:re-src=myIFrame:a.html

```html
<re-src upgrade=nav if-wants-to-be=persistable></re-src>
...

<nav be-persistable>
    <a href="a.html" target="myIFrame">A</a>
    <br>
    <a href="b.html" target="myIFrame">B</a>

</nav>
<iframe name="myIFrame"></iframe>
```

**NB:**  The syntax above for the url, in particular the :-: delimiter, is a temporary(?) fallback, inspired by the  [fragments standards proposals](https://github.com/slightlyoff/history_api#ui-state-fragments).  However, because the implementation of the fragment proposal is in the early stages, it appears that there's no way to read the hash value programmatically when the specified delimiter is used ( :~: ).  So for now we will use :-: instead:

https://mydomain.com/contextPath/myResource#:-:re-src=myIFrame:a.html

Hopefully soon there will be an api that allows reading fragment directives.

nav needs to confirm it has a hyperlink child with target=myIframe and href=a.html

If confirmed, then it sets myIFrame's src = a.html.

History.state also gets updated:

```JSON
{"reSrc":{"myIFrame":{"test":"b","textContent":"B"}}}
```

## iFrame caching [TODO]

The ability to load different url's into an iframe, without a single line of JavaScript, is a beauty to behold.  But there's one drawback -- if one switches back and forth between two different links, alternately loading the same views repetitively, reusing the same iframe means that we lose the effect of previous interactions, including scroll position for starters.   

So we want to enhance the hyperlink / iframe interplay, without losing the basic functionality we get sans JS.

```html
<re-src upgrade=nav if-wants-to-be=persistable></re-src>
...

<nav be-persistable>
    <a href="a.html" be-target-caching target="myIFrame">A</a>
    <br>
    <a href="b.html" be-target-caching target="myIFrame">B</a>

</nav>
<iframe name="myIFrame"></iframe>
```