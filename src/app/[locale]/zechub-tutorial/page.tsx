"use client";
import { useMemo, useState } from "react";
import TutorialCard from "@/components/TutorialCard/TutorialCard";
import { tutorials, topics } from "@/data/tutorials";
import styles from "./page.module.css";

const categories = ["All tutorials", ...topics.map((topic) => topic.name).filter((name) => tutorials.some((tutorial) => tutorial.category === name))];
const countFor = (name: string) => (name === "All tutorials" ? tutorials.length : tutorials.filter((tutorial) => tutorial.category === name).length);

export default function ZecHubTutorialsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All tutorials");
  const [sort, setSort] = useState("recent");
  const filteredTutorials = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tutorials.filter((tutorial) => category === "All tutorials" || tutorial.category === category)
      .filter((tutorial) => !query || `${tutorial.title} ${tutorial.category}`.toLowerCase().includes(query))
      .sort((a, b) => sort === "title" ? a.title.localeCompare(b.title) : b.id - a.id);
  }, [category, search, sort]);
  const grouped = category === "All tutorials" && !search.trim();
  const clearFilters = () => { setSearch(""); setCategory("All tutorials"); setSort("recent"); };

  return <main className={styles.container}>
    <section className={styles.hero}><div className={styles.eyebrow}>ZecHub learning library</div><h1>Learn Zcash, one tutorial at a time.</h1><p>Practical video guides for wallets, privacy, payments, development, and the wider Zcash ecosystem.</p></section>
    <section className={styles.library} aria-label="Tutorial library">
      <div className={styles.toolbar}>
        <label className={styles.searchWrap}><span className={styles.searchIcon} aria-hidden="true">⌕</span><span className={styles.srOnly}>Search tutorials</span><input className={styles.search} type="search" placeholder="Search by title or topic" value={search} onChange={(e) => setSearch(e.target.value)} />{search && <button className={styles.clearSearch} type="button" onClick={() => setSearch("")} aria-label="Clear search">×</button>}</label>
        <label className={styles.sortWrap}><span>Sort by</span><select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort tutorials"><option value="recent">Recently added</option><option value="title">Title A–Z</option></select></label>
      </div>
      <div className={styles.categoryRow} aria-label="Filter by category">{categories.map((item) => <button key={item} type="button" className={`${styles.categoryButton} ${category === item ? styles.active : ""}`} onClick={() => setCategory(item)}>{item} <span className={styles.chipCount}>{countFor(item)}</span></button>)}</div>
      <div className={styles.resultsBar}><p><strong>{filteredTutorials.length}</strong> {filteredTutorials.length === 1 ? "tutorial" : "tutorials"}</p>{(search || category !== "All tutorials" || sort !== "recent") && <button className={styles.reset} type="button" onClick={clearFilters}>Reset filters</button>}</div>
      {filteredTutorials.length > 0 && grouped ? <div className={styles.topics}>{topics.map((topic) => { const items = filteredTutorials.filter((tutorial) => tutorial.category === topic.name); return items.length === 0 ? null : <section key={topic.name} className={styles.topic} aria-labelledby={`topic-${topic.name}`}><div className={styles.topicHead}><div><h2 id={`topic-${topic.name}`}>{topic.name}</h2><p>{topic.description}</p></div><button type="button" className={styles.topicLink} onClick={() => setCategory(topic.name)}>{items.length} {items.length === 1 ? "tutorial" : "tutorials"} →</button></div><div className={styles.grid}>{items.map((tutorial) => <TutorialCard key={tutorial.id} tutorial={tutorial} />)}</div></section>; })}</div> : filteredTutorials.length > 0 ? <section className={styles.grid}>{filteredTutorials.map((tutorial) => <TutorialCard key={tutorial.id} tutorial={tutorial} />)}</section> : <div className={styles.empty}><span aria-hidden="true">⌕</span><h2>No tutorials found</h2><p>Try a different search term or browse all categories.</p><button type="button" onClick={clearFilters}>Clear filters</button></div>}
    </section>
  </main>;
}
