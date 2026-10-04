import React, { useContext, useMemo } from "react";
import { AppContext } from "../../../App";

const TIMEWALL_OID = "03239923cee7dd3d";

const TimeWallPage: React.FC = () => {
  const { user, isLoggedIn } = useContext(AppContext);

  const iframeSrc = useMemo(() => {
    if (!isLoggedIn || !user?.id) return "";
    // &view=surveys যোগ করা হয়েছে যাতে ডিফল্টভাবে সার্ভে ট্যাবটি সামনে আসে
    return `https://timewall.io/users/login?oid=${TIMEWALL_OID}&uid=${encodeURIComponent(
      String(user.id)
    )}&view=surveys`; 
  }, [isLoggedIn, user]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">TimeWall</h1>
        {/* এক্সটার্নাল ব্রাউজারে ওপেন করার বাটন (TimeWall রিকমেন্ডেশন) */}
        {isLoggedIn && (
          <a 
            href={iframeSrc} 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            Open in New Tab
          </a>
        )}
      </div>

      <div className="bg-white dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        {!isLoggedIn || !iframeSrc ? (
          <div className="text-slate-600 dark:text-slate-300">
            Please sign in to view TimeWall.
          </div>
        ) : (
          <iframe
            title="TimeWall"
            src={iframeSrc}
            width="100%"
            height="1000"
            scrolling="auto"
            style={{ border: 0 }}
            className="rounded-xl"
            /* সার্ভে প্রোভাইডারদের জন্য প্রয়োজনীয় সব পারমিশন এখানে যুক্ত করা হয়েছে */
            allow="clipboard-read; clipboard-write; fullscreen"
            /* allow-popups-to-escape-sandbox যোগ করা হয়েছে যাতে সার্ভে নতুন উইন্ডোতে লোড হতে পারে */
            sandbox="allow-forms allow-modals allow-popups allow-popups-to-escape-sandbox allow-scripts allow-same-origin"
          />
        )}
      </div>
    </div>
  );
};

export default TimeWallPage;
