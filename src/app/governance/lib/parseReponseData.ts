export function parseReponseData(data: string[][]) {
  const labelArr = data.slice(0, 1)[0].map((l) => l.replace(/\n/g, ""));

  const arrObj: any[] = [];

  data.slice(1, data.length).forEach((arr) => {
    const obj: Record<string, any> = {};

    arr.forEach((a, i) => {
      const key = labelArr[i];

      if (key && !obj[key] && a) {
        obj[key] = a;
      }
    });

    arrObj.push(obj);
  });

  return arrObj;
}
