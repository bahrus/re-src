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


nav needs to confirm it has a hyperlink child with target=myIframe and href=a.html

If confirmed, then it sets myIFrame's src = a.html.