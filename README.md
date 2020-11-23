# re-src

<a href="https://nodei.co/npm/re-src/"><img src="https://nodei.co/npm/re-src.png"></a>

<img src="https://badgen.net/bundlephobia/minzip/re-src">

The ability to load different url's into an iframe, without a single line of JavaScript, is a beauty to behold:

```html
<nav>
    <a href="a.html" target="myIFrame">A</a>
    <a href="b.html" target="myIFrame">B</a>
</nav>
...
<iframe name="myIFrame"></iframe>
```

However, this built-in functionality has a number of limitations:

1. Although back / forward functionality works in this scenario, the ability to copy and paste the "state" of which link is currently being viewed, as represented by the address bar, doesn't work.  You might be looking at page "A", but when you send the full url in the address bar to a friend, they won't see any iframe loaded.
2. Switching back and forth between the two links causes a server request to be made, checking if there's been an update to the resource (best case scenario).  While this might not be very costly, the bigger problem is that:
3. The iframe is reloaded each time you go back to a previously selected link, losing previous user interactions.  This can be also be quite costly for complex content that  uses rich, JS heavy libraries.

"re-src" and a few other web components described here, give the developer the ability to enhance / modify the native behavior of the hyperlink / iframe partnership.  re-src "progressively enhances" the native behavior, so until the library loads, the native functionality can be used, if that is desired.

## Persisting iFrame navigation with re-src web component.

The re-src web component, by itself, only addresses issue 1 above.

Syntax:

```html
<re-src></re-src>
...

<nav be-persistable>
    <a href="a.html" target="myIFrame">A</a>
    <a href="b.html" target="myIFrame">B</a>
</nav>
...
<iframe name="myIFrame"></iframe>
```

One re-src element needs be present in any ShadowDOM realm where you want the iframe navigation to persist.  If re-src element is placed outside any ShadowDOM, it applies to all nav tags outside any ShadowDOM.

Now the address bar will update, which can be shared to others, who will see the same content load as what you last selected.

If there's some other (conflicting) library that looks for / acts on the  "be-persistable" attribute on the nav element, you can namespace your instance:

```html
<re-src if-wants-to-be=re-src-persistable></re-src>
...

<nav be-re-src-persistable>
    <a href="a.html" target="myIFrame">A</a>
    <br>
    <a href="b.html" target="myIFrame">B</a>
</nav>
<iframe name="myIFrame"></iframe>
```

<details>
    <summary>Technical Notes</summary>

**NB:**  For the markup above, if you look at the way the address bar tracks the user interaction, it is clearly inspired by the  [fragments standards proposals](https://github.com/slightlyoff/history_api#ui-state-fragments).  However, because the implementation of the fragment proposal is in the early stages, it appears that there's no way to read the hash value programmatically when the specified delimiter is used ( :~: ). For that reason, the :-: delimiter is used as a temporary(?) fallback, until the api is more usable with the :~: delimiter.  So you will get url's like:

https://mydomain.com/contextPath/myResource#:-:re-src=myIFrame:a.html

## Security Validation

re-src confirms the nav element has a hyperlink child with target=myIframe and href=a.html.  

If confirmed, then it sets myIFrame's src = a.html.  If not confirmed, it is ignored.

Otherwise, the address bar could be used to load any arbitrary url.

## Effect on history.state

History.state also gets updated:

```JSON
{"reSrc":{"myIFrame":{"test":"b","textContent":"B"}}}
```

Other parts of history.state are preserved.

</details>

## iFrame caching with target-caching

Another web component, "target-caching" can be used, in combination with web component "at-most-one" to address problems 2. and 3. above. 

First, the only way to prevent reloading an iFrame, while retaining native functionality, is to create a one-to-one mapping between hyperlinks and iframes:

```html
<nav>
    <a href="a.html" target="myIFrameA">A</a>
    <br>
    <a href="b.html" target="myIFrameB">B</a>
</nav>
<iframe name="myIFrameA"></iframe>
<iframe name="myIFrameB"></iframe>
```

While this does prevent having to lose the loading of A content in order to see B, it doesn't really solve the problem yet -- clicking on A repeatedly will cause A to reload, likewise with clicking on B.  But it is an important first step.

The "target-caching" component affects hyperlinks with attribute "be-caching".  This attribute can also be customized.

What target-caching does is it intercepts the hyperlink's click event.  The first time, it let's the link pass through normally.  After that, it blocks the link ("preventDefault"), but passes the link's href to the iframe's src property programmatically.  In either case, it sets attribute "data-selected" attribute on the target iframe.

Unfortunately, if one clicks on both link A, and link B, both iframes will now have "data-selected" attribute, which means we can't use CSS to hide previously selected iFrames.

The web component ["at-most-one"](https://github.com/bahrus/at-most-one) prevents multiple instances of the same attribute within its child elements:

```html
<at-most-one attribute="data-selected">
    <iframe name="myIFrameA"></iframe>
    <iframe name="myIFrameB"></iframe>
</at-most-one>
```

So the entire markup, that addresses all three points above, looks like:

```html
<re-src></re-src>
<target-caching></target-caching>
<nav be-persistable='{"group":"myIFrame"}'>
    <a href="a.html" be-target-caching target="myIFrameA">A</a>
    <br>
    <a href="b.html" be-target-caching target="myIFrameB">B</a>
</nav>
<at-most-one attribute="data-selected">
    <iframe name="myIFrameA"></iframe>
    <iframe name="myIFrameB"></iframe>
</at-most-one>

<script type=module src="re-src/re-src.js"></script>
<script type=module src="re-src/target-caching.js"></script>
<script type=module src="at-most-one/at-most-one.js"></script>

<style>
    iframe{
        position:absolute;
        left: -20000px;
    }
    iframe[data-selected]{
        position:static;
    }
</style>
```

Note the extra setting we haven't seen before:  

```html
<nav be-persistable='{"group":"myIFrame"}'>
...
</nav>
```

This allows the address bar to encode which of the iframes in the targets specified within the nav tag was last selected.