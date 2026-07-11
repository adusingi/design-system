import { EntryCard } from "@mobayilo/ui";
import { ShowcasePanel } from "../../showcase-panel";
import { AlbumIcon, ArrowRightIcon, CalendarIcon, ClockIcon, HeartIcon, PinIcon, PlayIcon } from "./entry-card-icons";

// Same component, two domains: a mytrip travel-log entry (Love it / Open)
// and a umuzika library entry (Favorite / Play) — only content, icons, and
// action variants change.
export function EntryCards() {
  return (
    <ShowcasePanel label="Entry card — mytrip &amp; umuzika">
      <div className="mo-flex-wrap" style={{ alignItems: "stretch" }}>
        <EntryCard
          image={{ src: "https://picsum.photos/seed/kumamoto/640/400", alt: "Kumamoto" }}
          badge="1/2"
          title="Kumamoto"
          meta={[
            { icon: <PinIcon />, label: "Japan" },
            { icon: <CalendarIcon />, label: "Apr 2024", emphasis: true },
          ]}
          description="Suizen-ji and a castle reborn. Kumamoto surprised me — Suizen-ji Jōju-en is a strolling garden that miniaturises the old Tōkaidō road, including a little Mt Fuji of clipped grass."
          highlights={["Suizen-ji Jōju-en", "Kumamoto Castle", "Sakuranobaba Jōsaien"]}
          moreLabel="More about this place"
          primaryAction={{ icon: <HeartIcon />, label: "Love it", variant: "outline" }}
          secondaryAction={{ icon: <ArrowRightIcon />, label: "Open", variant: "outline" }}
        />

        <EntryCard
          image={{ src: "https://picsum.photos/seed/umuzika/640/400", alt: "Sunday Morning Mix" }}
          badge="12 tracks"
          title="Sunday Morning Mix"
          meta={[
            { icon: <AlbumIcon />, label: "Family Library" },
            { icon: <ClockIcon />, label: "42 min", emphasis: true },
          ]}
          description="Slow starts and old favorites — the playlist that plays every Sunday before church, curated from three generations of the family's history."
          highlights={["Amahoro — Kizito", "Umva — Bushali", "Ikaze — The Ben"]}
          moreLabel="View full tracklist"
          primaryAction={{ icon: <HeartIcon />, label: "Favorite", variant: "outline", pressed: true }}
          secondaryAction={{ icon: <PlayIcon />, label: "Play", variant: "accent" }}
        />
      </div>
    </ShowcasePanel>
  );
}
