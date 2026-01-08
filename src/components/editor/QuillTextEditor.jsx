import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

export default function QuillTextEditor({
  value = "",
  onChange,
  placeholder = "Write something...",
  minHeight = 200,
}) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    quillRef.current = new Quill(editorRef.current, {
      theme: "snow",
      placeholder,
      modules: {
        toolbar: [
          [{ font: [] }],
          [{ size: ["small", false, "large", "huge"] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ script: "sub" }, { script: "super" }],
          [{ header: 1 }, { header: 2 }, "blockquote", "code-block"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ direction: "rtl" }, { align: [] }],
          ["link", "image", "video"],
          ["clean"],
        ],
      },
    });

    quillRef.current.root.style.minHeight = `${minHeight}px`;

    quillRef.current.on("text-change", () => {
      onChange?.(quillRef.current.root.innerHTML);
    });
  }, []);

  /* Sync external value */
  useEffect(() => {
    if (
      quillRef.current &&
      value !== quillRef.current.root.innerHTML
    ) {
      quillRef.current.root.innerHTML = value || "";
    }
  }, [value]);

  return (
    <div className="rounded-xl border border-gray-300 bg-white">
      <div ref={editorRef} />
    </div>
  );
}
