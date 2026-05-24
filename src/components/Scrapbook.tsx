import React, { useState, useEffect } from "react";
import { Plus, Trash, Image as ImageIcon, Heart, Star, Sparkles, Smile, MessageCircle } from "lucide-react";
import { ScrapbookItem } from "../types";
import { motion, AnimatePresence } from "motion/react";

export default function Scrapbook() {
  const [items, setItems] = useState<ScrapbookItem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newSticker, setNewSticker] = useState("heart");
  const [newImage, setNewImage] = useState("");
  
  // Choose default beautifully styled memories so the app is immediately magical
  const defaultMemories: ScrapbookItem[] = [
    {
      id: "1",
      date: "Aug 2024",
      title: "Our First Movie Date",
      description: "Sharing the big popcorn tub and talking for hours in the parking lot. You laughed so hard your nose crinkled, and I knew right then you were special.",
      imageUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=600&auto=format&fit=crop",
      sticker: "heart"
    },
    {
      id: "2",
      date: "Dec 2024",
      title: "Wandering in Snowy Lights",
      description: "Remember how freezing cold it was? You stole my huge gloves but your fingers were still like ice blocks, so we shared pockets. Warmest night ever.",
      imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop",
      sticker: "star"
    },
    {
      id: "3",
      date: "Spring Picnic 2025",
      title: "The Singing Strawberries",
      description: "We tried baking that tiny strawberry pie, burnt the crust, and went to eat fruits on the grass instead. You wore that white sundress, looking like a dream.",
      imageUrl: "https://images.unsplash.com/photo-1526402978125-f1d6df913192?q=80&w=600&auto=format&fit=crop",
      sticker: "flower"
    }
  ];

  useEffect(() => {
    const cached = localStorage.getItem("sweet16_scrapbook");
    if (cached) {
      try {
        setItems(JSON.parse(cached));
      } catch (e) {
        setItems(defaultMemories);
      }
    } else {
      setItems(defaultMemories);
      localStorage.setItem("sweet16_scrapbook", JSON.stringify(defaultMemories));
    }
  }, []);

  const saveItems = (updatedItems: ScrapbookItem[]) => {
    setItems(updatedItems);
    localStorage.setItem("sweet16_scrapbook", JSON.stringify(updatedItems));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDesc || !newDate) return;

    const newItem: ScrapbookItem = {
      id: Date.now().toString(),
      date: newDate,
      title: newTitle,
      description: newDesc,
      imageUrl: newImage || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=600&auto=format&fit=crop",
      sticker: newSticker
    };

    const updated = [newItem, ...items];
    saveItems(updated);
    
    // Reset form
    setNewTitle("");
    setNewDesc("");
    setNewDate("");
    setNewImage("");
    setNewSticker("heart");
    setShowAddForm(false);
  };

  const handleDeleteItem = (id: string) => {
    const updated = items.filter(item => item.id !== id);
    saveItems(updated);
  };

  const renderStickerIcon = (type: string) => {
    switch (type) {
      case "heart":
        return <Heart className="w-5 h-5 text-rose-500 fill-rose-500 animate-pulse" />;
      case "star":
        return <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />;
      case "flower":
        return <Sparkles className="w-5 h-5 text-pink-400 fill-pink-100" />;
      case "balloon":
        return <Smile className="w-5 h-5 text-purple-400 animate-bounce" />;
      default:
        return <MessageCircle className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4" id="scrapbook-section">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-sans font-extrabold text-gray-800 flex items-center gap-2">
            📸 Our Sweet Memory Scrapbook
          </h3>
          <p className="text-sm text-gray-500">
            A beautiful catalog of the tiny moments that define us. Edit, remove, or pin your own precious photos!
          </p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-400 text-white font-semibold text-sm rounded-xl hover:from-pink-600 hover:to-rose-500 transition-all duration-300 shadow-md hover:shadow-lg"
          id="add-memory-button"
        >
          <Plus className="w-4 h-4" />
          {showAddForm ? "Close Form" : "Create New Memory"}
        </button>
      </div>

      {/* Add New Memory Form Popup Panel */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <form 
              onSubmit={handleAddItem}
              className="bg-white/90 border border-pink-100 rounded-2xl p-6 shadow-md flex flex-col gap-4 relative"
              id="new-scrapbook-form"
            >
              <h4 className="font-bold text-gray-800 text-base">Pin a Beautiful Date & Photo</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-600">Memory Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Baking our first cupcake together"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    className="border border-pink-100 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:ring-1 focus:ring-pink-400"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-600">When did this happen?</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Sept 14, 2024 or Just Today"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="border border-pink-100 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:ring-1 focus:ring-pink-400"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-600">The Sweet Story (Describe what made it unforgettable)</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Tell her why this single moment makes you smile..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="border border-pink-100 rounded-xl px-3 py-2 text-sm focus:outline-hidden focus:ring-1 focus:ring-pink-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Photo uploader */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-600">Upload Photo</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      id="scrapbook-image-file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      class="hidden"
                    />
                    <label
                      htmlFor="scrapbook-image-file"
                      className="flex items-center gap-2 bg-pink-50 text-pink-700 border border-pink-200 hover:bg-pink-100 cursor-pointer rounded-xl px-4 py-2 text-sm font-semibold transition"
                    >
                      <ImageIcon className="w-4 h-4" />
                      Choose Photo
                    </label>
                    {newImage && (
                      <div className="w-12 h-12 rounded-lg border-2 border-pink-200 overflow-hidden relative">
                        <img src={newImage} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Sticker picker */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-600">Choose sticker</label>
                  <div className="flex gap-2">
                    {["heart", "star", "flower", "balloon"].map((stickerType) => (
                      <button
                        key={stickerType}
                        type="button"
                        onClick={() => setNewSticker(stickerType)}
                        className={`p-2 rounded-xl border flex items-center justify-center transition ${
                          newSticker === stickerType 
                            ? "bg-pink-100 border-pink-300 text-pink-700 scale-115" 
                            : "bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100"
                        }`}
                      >
                        {renderStickerIcon(stickerType)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="bg-pink-500 hover:bg-pink-600 text-white py-2.5 rounded-xl text-sm font-bold shadow-md transition-all"
                id="submit-memory-form"
              >
                Pin onto Memory Board 📌
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid of Polaroid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center" id="scrapbook-polarized-grid">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, rotate: index % 2 === 0 ? -3 : 3, y: 30 }}
            animate={{ opacity: 1, rotate: index % 2 === 0 ? -1.5 : 1.5, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.03, rotate: 0, y: -5, boxShadow: "0px 20px 30px rgba(244, 63, 94, 0.1)" }}
            className="bg-white p-4 pb-6 shadow-xl border border-pink-100 rounded-lg max-w-xs w-full relative group transition-all duration-300"
          >
            {/* Draggable/Fixed visual sticker positioned dynamically */}
            <div className="absolute top-2.5 right-4 z-20 bg-white/70 backdrop-blur-xs p-1 rounded-full shadow-xs">
              {renderStickerIcon(item.sticker)}
            </div>

            {/* Simulated piece of cute pink washi tape pinning the photo */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-pink-100/80 rotate-1 shadow-xs border-x border-pink-200/40 select-none flex items-center justify-center font-mono text-[9px] font-extrabold text-pink-600/70 tracking-tight">
              SWEET HEARTS
            </div>

            {/* Picture block */}
            <div className="w-full h-52 overflow-hidden rounded-md border border-gray-100 bg-gray-50 relative">
              <img 
                src={item.imageUrl} 
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover select-none pointer-events-none group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute bottom-2 left-2 bg-black/50 text-white rounded-md px-2 py-0.5 text-[10px] uppercase font-mono tracking-widest leading-none">
                {item.date}
              </div>
            </div>

            {/* Description & Writing frame resembling a handwriting card */}
            <div className="mt-4 text-left">
              <h5 className="font-sans font-extrabold text-gray-800 text-sm tracking-tight capitalize border-b border-pink-50 pb-1.5 flex items-center justify-between">
                <span>{item.title}</span>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-rose-500 transition-all rounded duration-200"
                  title="Remove memory"
                  id={`delete-memory-${item.id}`}
                >
                  <Trash className="w-3.5 h-3.5" />
                </button>
              </h5>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed font-sans font-medium line-clamp-4">
                {item.description}
              </p>
            </div>
          </motion.div>
        ))}
        
        {items.length === 0 && (
          <div className="col-span-full border-2 border-dashed border-pink-100 rounded-3xl p-12 text-center text-gray-400 max-w-md bg-white/40">
            <ImageIcon className="w-12 h-12 text-pink-200 mx-auto mb-3" />
            <h5 className="font-bold text-gray-700">Scrapbook is empty</h5>
            <p className="text-xs text-gray-500 mt-1">Create your first special memory using the button above!</p>
          </div>
        )}
      </div>
    </div>
  );
}
