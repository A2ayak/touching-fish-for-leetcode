### 一、性能优化

#### 1. 插件&全局样式透传

```
<WujieVue
    :name="appStore.childApp.name"
    :url="appStore.childApp.url"
    :sync="true"
    :plugins="plugins"
    :prefix="prefix"
    width="100%"
    height="100%"
  />
```

```

const plugins = [
  {
    patchElementHook,
    cssLoader,
    appendOrInsertElementHook,
    cssBeforeLoaders: [
      // 强制使子应用body定位是relative
      { content: "body{position: relative !important; height: 100%;}" },
      // 解决子应用高度问题
      { content: "html{height: 100%}" },
      { content: "#app{height: 100%}" },
    ],
    // 给子应用统一注入通用样式
    cssAfterLoaders: [{ src: `/style/gri-components.css` }],
  },
  InstanceofPlugin(),
];

function patchElementHook(element: any, iframeWindow: any) {
  if (element.nodeName === "STYLE") {
    element.insertAdjacentElement = function (_position: any, ele: any) {
      iframeWindow.document.head.appendChild(ele);
    };
  }
}
function cssLoader(code: string) {
  const rootStyleReg = /:root/g;
  const hostStyleReg = /:host/g;
  let newCode = code;
  newCode = newCode.replace(rootStyleReg, ":host").replace(hostStyleReg, ":host html");
  return newCode;
}
function appendOrInsertElementHook(element: HTMLElement, iframeWindow: any) {
  if (
    element.nodeName === "svg" &&
    (element.getAttribute("aria-hidden") === "true" ||
      element.style.display === "none" ||
      element.style.visibility === "hidden" ||
      (element.style.height === "0px" && element.style.width === "0px"))
  ) {
    iframeWindow.__WUJIE.styleSheetElements.push(element);
  }
}
```

```
// nginx.conf
location /style/ {
  add_header 'Access-Control-Allow-Origin' '*';
  add_header 'Access-Control-Allow-Methods' 'GET, OPTIONS';
  add_header 'Access-Control-Allow-Headers' '*';
  alias /usr/share/nginx/html/gzgk/global-style/;
}
```
