"use client";
import { useState } from "react";
import TutorialCard from "@/components/TutorialCard/TutorialCard";
import { tutorials } from "@/data/tutorials";
import styles from "./page.module.css";

export default function ZecHubTutorialsPage() {
    const [search, setSearch] = useState("");
    const filteredTutorials = tutorials.filter((tutorial) =>
        tutorial.title.toLowerCase().includes(search.toLowerCase())
    );
    return (
        <main className={styles.container}>
            <div className={styles.hero}>
                <h1>ZecHub Tutorials</h1>
                <p>
                    Browse all ZecHub tutorials in one place. Search by title and quickly
                    jump to the tutorial you need.
                </p>

                <input
                    className={styles.search}
                    type="text"
                    placeholder="Search tutorials..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            <section className={styles.grid}>
                {filteredTutorials.map((tutorial) => (
                    <TutorialCard
                        key={tutorial.id}
                        tutorial={tutorial}
                    />
                ))}
            </section>
        </main>
    );
}