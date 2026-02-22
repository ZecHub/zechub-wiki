const parseMoney = (value?: string): number | null => {
  if (!value || value.trim() === "") return null;

  return Number(value.replace(/[$,]/g, "")) || null;
};

export const parseNumber=(value?:string):number|null=>{
    if(!value||value.trim()==='') return null;

    return Number(value) || null;
}


