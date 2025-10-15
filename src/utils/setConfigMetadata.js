export function setFavicon(iconURL) {
  const link = document.querySelectorAll("link[rel~='icon']");

  if (!link) {
    const newLink = document.createElement("link");
    newLink.rel = "icon";
    newLink.href = iconURL;
    document.head.appendChild(newLink);
  } else {
    link.forEach((li) => {
      
      li.href = iconURL;
    })
  }
}

export const setSiteTitle = (title) => {
  const titleEle = document.querySelector("title");
  console.log("titleEle", titleEle);
  
  if (titleEle) {
    titleEle.textContent = title;
  }
}