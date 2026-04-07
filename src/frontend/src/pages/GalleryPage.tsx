import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { useAllMedia } from "../hooks/useQueries";

const SKELETON_KEYS = ["s1", "s2", "s3", "s4", "s5", "s6", "s7", "s8"];

export function GalleryPage() {
  const { data: media, isLoading } = useAllMedia();

  return (
    <main className="min-h-screen">
      <section
        className="py-24 text-center"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.12 0.006 220) 0%, oklch(0.16 0.02 25) 100%)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-primary text-xs font-bold uppercase tracking-widest mb-3">
            Visual Archive
          </p>
          <h1 className="font-display text-5xl font-extrabold uppercase text-foreground">
            Gallery
          </h1>
          <div className="mt-4 w-16 h-0.5 bg-primary mx-auto" />
        </motion.div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              data-ocid="gallery.loading_state"
            >
              {SKELETON_KEYS.map((k) => (
                <Skeleton key={k} className="aspect-square rounded-lg" />
              ))}
            </div>
          ) : !media?.length ? (
            <div className="text-center py-20" data-ocid="gallery.empty_state">
              <p className="text-5xl mb-4">📷</p>
              <p className="text-lg font-bold text-foreground">
                No media available
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Gallery content will appear here
              </p>
            </div>
          ) : (
            <div
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              data-ocid="gallery.list"
            >
              {media.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="aspect-square bg-card border border-border rounded-lg overflow-hidden flex items-center justify-center group hover:border-primary/40 transition-colors"
                  data-ocid={`gallery.item.${i + 1}`}
                >
                  {item.blob ? (
                    <img
                      src={item.blob.getDirectURL()}
                      alt={item.fileName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-center p-4">
                      <p className="text-3xl mb-2">📄</p>
                      <p className="text-xs text-muted-foreground truncate max-w-full">
                        {item.fileName}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
