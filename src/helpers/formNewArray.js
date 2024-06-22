export   const formNewArray = (dates, orchard, sapling, sprout) => {
    const newOrchardArray = [];
    const newSproutArray = [];
    const newSaplingArray = [];

    for (let i = 0; i < dates.length; i++) {
      const dateArrayDate = dates[i];

      // console.log(dateArrayDate)
      //Orchard Data
      for (let j = 0; j < orchard.length; j++) {
        const orchardDate = orchard[j];
        if (
          new Date(dateArrayDate).getTime() ===
          new Date(orchardDate.close).getTime()
        ) {
          newOrchardArray.push(orchardDate);
        }
      }
      if (newOrchardArray[i] === undefined) {
        newOrchardArray.push({ supply: 0, close: dates[i] });
      }

      //Sprout Data
      for (let k = 0; k < sprout.length; k++) {
        const sproutDate = sprout[k];
        if (
          new Date(dateArrayDate).getTime() ===
          new Date(sproutDate.close).getTime()
        ) {
          newSproutArray.push(sproutDate);
        }
      }
      if (newSproutArray[i] === undefined) {
        newSproutArray.push({ supply: 0, close: dates[i] });
      }

      // Sapling Data
      for (let l = 0; l < sapling.length; l++) {
        const saplingDate = sapling[l];
        if (
          new Date(dateArrayDate).getTime() ===
          new Date(saplingDate.close).getTime()
        ) {
          newSaplingArray.push(saplingDate);
        }
      }
      if (newSaplingArray[i] === undefined) {
        newSaplingArray.push({ supply: 0, close: dates[i] });
      }

      //Fine tune each array
      //Orchard Array
      for (let p = 0; p < newOrchardArray.length; p++) {
        const element = newOrchardArray[p];

        if (p === 0) {
          p++;
        } else if (element.supply === 0) {
          if (newOrchardArray[p - 1].supply !== 0) {
            //Loop over the orchard array again and grab the next available date and update the date at that position
            for (let j = 0; j < orchard.length; j++) {
              const orchardDate = orchard[j];
              if (
                new Date(newOrchardArray[p].close).getTime() + 86400000 ===
                new Date(orchardDate.close).getTime()
              ) {
                newOrchardArray[p] = {
                  supply: orchardDate.supply,
                  close: newOrchardArray[p].close,
                };
              }
            }
          }
        }
      }

      //Sprout Array
      for (let p = 0; p < newSproutArray.length; p++) {
        const element = newSproutArray[p];

        if (p === 0) {
          p++;
        } else if (element.supply === 0) {
          if (newSproutArray[p - 1].supply !== 0) {
            //Loop over the sapling array again and grab the next available date and update the date at that position
            for (let j = 0; j < sprout.length; j++) {
              const sproutDate = sprout[j];
              if (
                new Date(newSproutArray[p].close).getTime() + 86400000 ===
                new Date(sproutDate.close).getTime()
              ) {
                newSproutArray[p] = {
                  supply: sproutDate.supply,
                  close: newSproutArray[p].close,
                };
              }
            }
          }
        }
      }

      //Sapling Array
      for (let p = 0; p < newSaplingArray.length; p++) {
        const element = newSaplingArray[p];

        if (p === 0) {
          p++;
        } else if (element.supply === 0) {
          if (newSaplingArray[p - 1].supply !== 0) {
            //Loop over the sapling array again and grab the next available date and update the date at that position
            for (let j = 0; j < sapling.length; j++) {
              const saplingDate = sapling[j];
              if (
                new Date(newSaplingArray[p].close).getTime() + 86400000 ===
                new Date(saplingDate.close).getTime()
              ) {
                newSaplingArray[p] = {
                  supply: saplingDate.supply,
                  close: newSaplingArray[p].close,
                };
              }
            }
          }
        }
      }
    }

    return [
      { name: "orchard", data: newOrchardArray },
      { name: "sprout", data: newSproutArray },
      { name: "sapling", data: newSaplingArray },
    ];
  };