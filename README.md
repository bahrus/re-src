# re-src

##  iFrame you [TODO]

The hyperlink tag supports a target attribute, which causes an iframe to load the content of the url.  However, this doesn't update the address bar, so it is difficult to bookmark or email this state.

```html
<nav>
    <a href="a.html" target="myIFrame">A</a>
    <br>
    <a href="b.html" target="myIFrame">B</a>

</nav>
<iframe name="myIFrame"></iframe>
```

Now we don't need to block the link from doing its thing.  We do need to update the address bar.  Suggested syntax:

https://mydomain.com/contextPath/myResource#:~:re-src=myIFrame:a.html

nav needs to confirm it has a hyperlink child with target=myIframe and href=a.html

If confirmed, then it sets myIFrame's src = a.html.