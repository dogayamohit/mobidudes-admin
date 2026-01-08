import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default function CKTextEditor({
  value = "",
  onChange,
  placeholder = "Start typing...",
  height = "300px",
}) {
  return (
    <div className="rounded-xl border border-gray-300 bg-white">
      <CKEditor
        editor={ClassicEditor}
        data={value}
        config={{
          placeholder,
          toolbar: {
            items: [
              "heading",
              "|",
              "bold",
              "italic",
              "underline",
              "strikethrough",
              "|",
              "fontSize",
              "fontColor",
              "fontBackgroundColor",
              "|",
              "alignment",
              "|",
              "numberedList",
              "bulletedList",
              "outdent",
              "indent",
              "|",
              "link",
              "blockQuote",
              "insertTable",
              "mediaEmbed",
              "undo",
              "redo",
            ],
          },
        }}
        onChange={(event, editor) => {
          const data = editor.getData();
          onChange?.(data);
        }}
        onReady={(editor) => {
          editor.editing.view.change((writer) => {
            writer.setStyle(
              "min-height",
              height,
              editor.editing.view.document.getRoot()
            );
          });
        }}
      />
    </div>
  );
}
