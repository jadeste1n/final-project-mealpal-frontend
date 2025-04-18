import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Bookmark, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RecipeFabMenu = () => {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((prev) => !prev);

  return (
    <div className="fixed bottom-20 right-5 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-end gap-2 mb-2"
          >
            <Link
              to="/recipes"
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg"
              onClick={() => setOpen(false)}
            >
              <Bookmark className="w-4 h-4" /> Saved Recipes
            </Link>
            <Link
              to="/recipes/create"
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg"
              onClick={() => setOpen(false)}
            >
              <ChefHat className="w-4 h-4" /> Create Recipe
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggle}
        whileTap={{ scale: 0.9 }}
        className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-lg"
      >
        {open ? <X className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
      </motion.button>
    </div>
  );
};

export default RecipeFabMenu;
