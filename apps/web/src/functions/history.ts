export function history(posts: { date: Date; active: boolean }[]): {
  month: number | undefined; 
  year: number | undefined; 
  count: number | undefined;
}[] {
  //declare an object: key is "year-month", value is count of posts in that month
  const historyMap: Record<string, number> = {};
  let month: number | undefined = undefined;
  let year: number | undefined = undefined;

  posts
    .filter((p) => p.active)
    .forEach((post) => {
      const date = post.date;
      month = date.getMonth() + 1; // getMonth returns 0-11
      year = date.getFullYear();
      const key = `${year}-${month}`;
      historyMap[key] = (historyMap[key] || 0) + 1;
    });
  
  //return on order of recent to old
  return Object.keys(historyMap).map((key) => {
    //split the key to get year and month as number
    const [year, month] = key.split('-').map(Number);
    return {
      month,
      year,
      count: historyMap[key],
    };
  }).sort((a, b) => {
    //sort by year desc, then by month desc
    if ((b.year || 0) !== (a.year || 0)) {
      return (b.year || 0) - (a.year || 0);
    }
    return (b.month || 0) - (a.month || 0);
  });

}
