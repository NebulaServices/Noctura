if (typeof window === "object") {
  const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);

  let currentNode;

  while ((currentNode = walk.nextNode())) {
    console.log(currentNode);
    currentNode.textContent = ":3";
  }
}
