import { ArrowLeft, Sparkle, TextIcon, UploadIcon } from "lucide-react";
import React, { useState } from "react";

const StoryModal = ({ setShowModal, fetchStories }) => {
  const bgColor = [
    "#4f46e5",
    "#7c3aed",
    "#db2777",
    "#e11d48",
    "#ca8a04",
    "#0d9488",
  ];

  const [mode, setMode] = useState("text");
  const [background, setBackground] = useState(bgColor[0]);
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleMediaUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setMedia(file);
      setPreviewUrl(URL.createObjectURL(file));
      setMode("media");
    }
    // bir xil faylni qayta tanlash mumkin bo'lishi uchun
    e.target.value = "";
  };

  const handleRemoveMedia = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setMode("text");
    setMedia(null);
    setPreviewUrl(null);
  };

  const handleCreateStory = async () => {
    // TODO: backendga yuborish (text, media, background)
  };

  return (
    <div className="fixed inset-0 z-[110] min-h-screen bg-black/80 backdrop-blur text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-4 flex items-center justify-between">
          <button
            className="text-white p-2 cursor-pointer"
            onClick={() => setShowModal(false)}
          >
            <ArrowLeft />
          </button>
          <h2 className="text-lg font-semibold">Create Story</h2>
          <span className="w-10"></span>
        </div>

        {/* Preview: rasm/video orqada, matn ustida */}
        <div
          className="rounded-lg h-96 flex items-center justify-center relative overflow-hidden"
          style={{ backgroundColor: background }}
        >
          {previewUrl &&
            (media?.type.startsWith("image") ? (
              <img
                src={previewUrl}
                alt=""
                className="absolute inset-0 w-full h-full object-contain"
              />
            ) : (
              <video
                src={previewUrl}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-contain"
              />
            ))}

          <textarea
            className="relative z-10 bg-transparent text-white w-full h-full p-6 text-lg resize-none focus:outline-none break-words"
            style={{ overflowWrap: "anywhere" }}
            placeholder="What's on your mind?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {/* Fon ranglari */}
        <div className="flex mt-4 gap-2">
          {bgColor.map((color) => (
            <button
              key={color}
              className="w-6 h-6 rounded-full ring cursor-pointer"
              style={{ backgroundColor: color }}
              onClick={() => setBackground(color)}
            />
          ))}
        </div>

        {/* Tugmalar */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={handleRemoveMedia}
            className={`flex-1 flex items-center justify-center gap-2 p-2 cursor-pointer rounded ${mode === "text" ? "bg-white text-black" : "bg-zinc-800"
              }`}
          >
            <TextIcon size={18} /> {media ? "Remove media" : "Text"}
          </button>

          <label
            className={`flex-1 flex justify-center items-center gap-2 p-2 rounded cursor-pointer ${mode === "media" ? "bg-white text-black" : "bg-zinc-800"
              }`}
          >
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleMediaUpload}
            />
            <UploadIcon size={18} /> Photo/Video
          </label>
        </div>

        <button
          onClick={handleCreateStory}
          className="flex items-center justify-center gap-2 text-white py-3 mt-4 w-full rounded bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition cursor-pointer"
        >
          <Sparkle size={18} /> Create Story
        </button>
      </div>
    </div>
  );
};

export default StoryModal;