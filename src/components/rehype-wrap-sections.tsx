import { h } from "hastscript";

const rehypeWrapSections = () => {
  return (tree: { children: any[] }) => {
    let newChildren: any[] = [];
    let sectionChildren: any[] = [];
    let filterNodeHTML: any[] = [];

    let devicesFilterHTML: any[] = [];
    let poolsFilterHTML: any[] = [];
    let featuresFilterHTML: any[] = [];

    let devicesFilter: string[] = [];
    let poolsFilter: string[] = [];
    let featuresFilter: string[] = [];

    const createToggle = (element: string) => {

      return [
        h(
          "label",
          { class: "filter-item--label", for: "filter-item--input-" + removeSpecialChars(element) },
          element
        ),
        h("input", {
          class: "filter-item--input",     
          id: "filter-item--input-" + removeSpecialChars(element),
          type: "checkbox",
        }),
      ];
    };

    const removeSpecialChars = (str: string) => {
      const allowedChars = new Set('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
      return str.split('').filter(char => allowedChars.has(char)).join('');
    }

    const flushSection = () => {
      if (sectionChildren.length > 0) {
        let itemClasses: string = '';
        const walletLink = sectionChildren[0].children[0].properties.href;
        const walletLogo = sectionChildren[1].children[0].properties.src;
        const walletTitle = sectionChildren[0].children[0].children[0].value;
        const walletDevices =
          sectionChildren[2].children[1].children[0].value.split(/\s*\:\s*/)[1];

        let walletDevicesHTML: any[] = [];
        walletDevices.split(/\s*\|\s*/).forEach((element: string) => {
          walletDevicesHTML.push(
            h("div", { class: "wallet-tag-item" }, element)
          );

          itemClasses += ' tag-' + removeSpecialChars(element);

          if (devicesFilter.indexOf(element) === -1) {
            devicesFilter.push(element);
            devicesFilterHTML.push(
              h("div", { class: "filter-item" }, createToggle(element))
            );
          }
        });

        const walletPools =
          sectionChildren[2].children[3].children[0].value.split(/\s*\:\s*/)[1];
        let walletPoolsHTML: any[] = [];
        walletPools.split(/\s*\|\s*/).forEach((element: string) => {
          walletPoolsHTML.push(h("div", { class: "wallet-tag-item" }, element));

          itemClasses += ' tag-' + removeSpecialChars(element);

          if (poolsFilter.indexOf(element) === -1) {
            poolsFilter.push(element);
            poolsFilterHTML.push(
              h("div", { class: "filter-item" }, createToggle(element))
            );
          }
        });

        const walletFeatures =
          sectionChildren[2].children[5].children[0].value.split(/\s*\:\s*/)[1];
        let walletFeaturesHTML: any[] = [];
        walletFeatures.split(/\s*\|\s*/).forEach((element: string) => {
          walletFeaturesHTML.push(
            h("div", { class: "wallet-tag-item" }, element)
          );

          itemClasses += ' tag-' + removeSpecialChars(element);

          if (featuresFilter.indexOf(element) === -1) {
            featuresFilter.push(element);
            featuresFilterHTML.push(
              h("div", { class: "filter-item" }, createToggle(element))
            );
          }
        });

        newChildren.push(
          h(
            "div.wallet-item", { class: "w-full h-full inline-block p-2"+itemClasses },
            h("div",{class:"h-full border rounded-lg shadow-lg bg-white dark:bg-gray-800 p-5"},
              [
                h("a", { href: walletLink }, h("img", { src: walletLogo })),
                h(
                  "h5",
                  {
                    class:
                      "text-xl text-center my-4 font-bold text-blue-700 dark:text-blue-400",
                  },
                  walletTitle
                ),
                h("div", { class: "wallet-meta" }, [
                  h(
                    "div",
                    { class: "wallet-tag tag-devices" },
                    walletDevicesHTML
                  ),
                  h("div", { class: "wallet-tag tag-pools" }, walletPoolsHTML),
                  h(
                    "div",
                    { class: "wallet-tag tag-features" },
                    walletFeaturesHTML
                  ),
                ]),
              ]
            )
          )
        );

        sectionChildren = [];
      }
    };

    tree.children.forEach((node: { tagName?: string }) => {
      if (node.tagName === "hr") {
        flushSection();
      } else {
        if (node.tagName) {
          sectionChildren.push(node);
        }
      }
    });

    flushSection();

    devicesFilterHTML.forEach((node) => {
      if (node.tagName === 'div') {
        const { properties, children } = node;
        node.properties = { ...properties, onClick: `window.handleClick()` };
        node.children = children;
      }
    });

    filterNodeHTML.push(
      h("div", { class: "w-full" }, [
        h("form", { id: "filter-wallets", action: "/submit" }, [
          h("h3", "Filters"),
          h("h5", "Devices"),
          devicesFilterHTML,
          h("h5", "Pools"),
          poolsFilterHTML,
          h("h5", "Features"),
          featuresFilterHTML,
        ]),
      ])
    );

    tree.children = [
      h("div", { class: "wallet-filter " }, filterNodeHTML),
      h(
        "div",
        {
          class:
            "flex-auto px-3 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
        },
        newChildren
      ),
    ];
  };
};

export default rehypeWrapSections;
