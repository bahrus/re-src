# re-src

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

https://mydomain.com/contextPath/myResource#:~:re-src=myIFrame:a.html

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

**NB:**  The syntax above for the url, in particular the :~: delimiter, was chosen to piggy-back on [standards proposals](https://github.com/slightlyoff/history_api#ui-state-fragments).  However, because the implementation of the fragment proposal is in the early stages, it appears that there's no way to read the hash value programmatically when that delimiter is used.  So for now we will use :-: instead:

https://mydomain.com/contextPath/myResource#:-:re-src=myIFrame:a.html


nav needs to confirm it has a hyperlink child with target=myIframe and href=a.html

If confirmed, then it sets myIFrame's src = a.html.