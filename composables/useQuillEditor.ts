import { ref } from "vue";

export function useQuillEditor() {
  // Font options
  const fontSizeArr = [
    "8px",
    "9px",
    "10px",
    "12px",
    "14px",
    "16px",
    "18px",
    "20px",
    "24px",
    "36px",
    "48px",
    "60px",
    "72px",
  ];
  const fontFamilyArr = [
    "Arial",
    "Arial Black",
    "Comic Sans MS",
    "Courier New",
    "Georgia",
    "Helvetica",
    "Impact",
    "Tahoma",
    "Times New Roman",
    "Verdana",
  ];

  // Custom table options
  const tableOptions = {
    operationMenu: {
      items: {
        insertColumnRight: {
          text: "Insert Column Right",
        },
        insertColumnLeft: {
          text: "Insert Column Left",
        },
        insertRowUp: {
          text: "Insert Row Above",
        },
        insertRowDown: {
          text: "Insert Row Below",
        },
        deleteColumn: {
          text: "Delete Column",
        },
        deleteRow: {
          text: "Delete Row",
        },
        deleteTable: {
          text: "Delete Table",
        },
      },
    },
  };

  // Quill configuration
  const editorOptions = {
    modules: {
      table: tableOptions,
      toolbar: {
        container: [
          [{ font: fontFamilyArr }],
          [{ size: fontSizeArr }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ script: "sub" }, { script: "super" }],
          ["blockquote", "code-block"],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ direction: "rtl" }],
          ["link", "image", "video"],
          ["table"],
          ["clean"],
        ],
        handlers: {
          table: function () {
            return true; // Will be handled by the component
          },
        },
      },
    },
    placeholder: "Write something...",
  };

  return {
    editorOptions,
  };
}
