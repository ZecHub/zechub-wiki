
import { h } from 'hastscript';

const rehypeWrapSections = () => {
  return (tree: { children: any[]; }) => {
    let newChildren: any[] = [];
    let sectionChildren: any[] = [];
    let foundFirstHr = false; // Flag to track the first <hr>

    const flushSection = () => {
      if (sectionChildren.length > 0) {
        //console.log("Debug sectionChildren", JSON.stringify(sectionChildren, null, 2));
        if(foundFirstHr == false ){
          newChildren.push(h('div.wallet-header', {class:'col-12'},sectionChildren));
          foundFirstHr = true;
        } else {     
          newChildren.push(
            h('div.wallet-item', 
              {class:'w-full h-full inline-block p-2 hover:-translate-y-3', href:sectionChildren[1].attributes[0].value}, 
              h('div',
                {class:'h-full border rounded-lg shadow-lg bg-white dark:bg-gray-800 p-5'},
                sectionChildren
              )
            )
          );
        }
        
        sectionChildren = [];
      }
    };

    tree.children.forEach((node: { tagName?: string; }) => {
      if (node.tagName === 'hr') {
        flushSection();
      } else {
        sectionChildren.push(node);
      }
    });

    flushSection();

    tree.children = newChildren;
  };
};

export default rehypeWrapSections;
