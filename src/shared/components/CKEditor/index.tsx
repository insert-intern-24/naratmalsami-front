import { useState, useEffect, useRef, useMemo } from "react";
import { useParams } from "react-router-dom";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import {
  DecoupledEditor,
  Alignment,
  Autoformat,
  AutoImage,
  AutoLink,
  Autosave,
  Base64UploadAdapter,
  BlockQuote,
  Bookmark,
  BalloonToolbar,
  Bold,
  Code,
  CodeBlock,
  Essentials,
  FindAndReplace,
  FontBackgroundColor,
  FontColor,
  FontFamily,
  FontSize,
  FullPage,
  GeneralHtmlSupport,
  Heading,
  Highlight,
  HorizontalLine,
  HtmlComment,
  HtmlEmbed,
  ImageBlock,
  ImageCaption,
  ImageInline,
  ImageInsert,
  ImageInsertViaUrl,
  ImageResize,
  ImageStyle,
  ImageTextAlternative,
  ImageToolbar,
  ImageUpload,
  Indent,
  IndentBlock,
  Italic,
  Link,
  LinkImage,
  List,
  ListProperties,
  MediaEmbed,
  Mention,
  PageBreak,
  Paragraph,
  PasteFromMarkdownExperimental,
  PasteFromOffice,
  RemoveFormat,
  ShowBlocks,
  SourceEditing,
  SpecialCharacters,
  SpecialCharactersArrows,
  SpecialCharactersCurrency,
  SpecialCharactersEssentials,
  SpecialCharactersLatin,
  SpecialCharactersMathematical,
  SpecialCharactersText,
  Strikethrough,
  Style,
  Subscript,
  Superscript,
  Table,
  TableCaption,
  TableCellProperties,
  TableColumnResize,
  TableProperties,
  TableToolbar,
  TextPartLanguage,
  TextTransformation,
  TodoList,
  Underline,
  WordCount,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";

import "./style.css";
import { useDocument } from "@/shared/stores/useDocument";
import generateUniqueId from "@/utils/generateUniqueId";
import * as S from "./WriteHeader/style";
import Timer from "tiny-timer";

// const LICENSE_KEY = import.meta.env.VITE_CKEDITOR_LICENSE_KEY;
const LICENSE_KEY = "GPL";

export default function CKEditorComponent() {
  const editorContainerRef = useRef(null);
  const editorMenuBarRef = useRef(null);
  const editorToolbarRef = useRef(null);
  const editorRef = useRef(null);
  const editorWordCountRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const { hashed_id } = useParams();
  const timerRef = useRef(new Timer());
  const { updateDocument, initDocument } = useDocument();

  // 파일 데이터 정의
  interface fileDataType {
    title: string;
    content: string;
    hashed_id: string;
    updated_at: string;
  }
  
  // 파일 데이터 상태
  const [fileData, setFileData] = useState<fileDataType>({
    title: "",
    content: "",
    hashed_id: "",
    updated_at: "",
  });
  
  function grantDataUnique() {
    const parentDiv = document.querySelector(".ck-editor__editable");
    
    if (parentDiv) {
      // Only select direct children using :scope > *
      parentDiv.querySelectorAll(":scope > *").forEach((el) => {
        if (!el.hasAttribute("data-unique")) {
          el.setAttribute("data-unique", generateUniqueId());
        }
      });
    }
  };
  // 타이머 설정 및 정리
  useEffect(() => {
    const timer = timerRef.current;

    // 에디터 미사용 액션
    timer.on("done", () => {
      grantDataUnique();
      const currentVirtualData = editorRef.current?.instance?.getData() || "";
      updateDocument(currentVirtualData);
    });

    // 컴포넌트 언마운트 시 타이머 정리
    return () => {
      timer.stop();
    };
  }, [updateDocument]);

  // 파일 데이터 호출
  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/files/${hashed_id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();

        // 파일 데이터 설정
        setFileData(data);
        // 추후 파일 데이터와 zustand를 활용한 전역변수를 합칠 생각도 해야함
        initDocument(data.content);

        // CKEditor 준비 완료
        setIsLayoutReady(true);
        return () => setIsLayoutReady(false);
      } catch (error) {
        console.error("Error:", error);
      }
    })();
  }, []);

  const { editorConfig } = useMemo(() => {
    if (!isLayoutReady) {
      return {};
    }

    return {
      editorConfig: {
      toolbar: {
        items: [
        "heading",
        "|",
        "fontSize",
        "fontFamily",
        "fontColor",
        "fontBackgroundColor",
        "|",
        "bold",
        "italic",
        "underline",
        "|",
        "link",
        "insertTable",
        "|",
        "alignment",
        "|",
        "outdent",
        "indent",
        ],
        shouldNotGroupWhenFull: false,
      },
      plugins: [
        Alignment,
        Autoformat,
        AutoImage,
        AutoLink,
        Autosave,
        Base64UploadAdapter,
        BlockQuote,
        Bold,
        Bookmark,
        Code,
        CodeBlock,
        BalloonToolbar,
        Essentials,
        FindAndReplace,
        FontBackgroundColor,
        FontColor,
        FontFamily,
        FontSize,
        FullPage,
        GeneralHtmlSupport,
        Heading,
        Highlight,
        HorizontalLine,
        HtmlComment,
        HtmlEmbed,
        ImageBlock,
        ImageCaption,
        ImageInline,
        ImageInsert,
        ImageInsertViaUrl,
        ImageResize,
        ImageStyle,
        ImageTextAlternative,
        ImageToolbar,
        ImageUpload,
        Indent,
        IndentBlock,
        Italic,
        Link,
        LinkImage,
        List,
        ListProperties,
        MediaEmbed,
        Mention,
        PageBreak,
        Paragraph,
        PasteFromMarkdownExperimental,
        PasteFromOffice,
        RemoveFormat,
        ShowBlocks,
        SourceEditing,
        SpecialCharacters,
        SpecialCharactersArrows,
        SpecialCharactersCurrency,
        SpecialCharactersEssentials,
        SpecialCharactersLatin,
        SpecialCharactersMathematical,
        SpecialCharactersText,
        Strikethrough,
        Style,
        Subscript,
        Superscript,
        Table,
        TableCaption,
        TableCellProperties,
        TableColumnResize,
        TableProperties,
        TableToolbar,
        TextPartLanguage,
        TextTransformation,
        TodoList,
        Underline,
        WordCount,
      ],
      balloonToolbar: ["bold", "italic", "|", "link"],
      fontFamily: {
        supportAllValues: true,
      },
      fontSize: {
        options: [10, 12, 14, "default", 18, 20, 22],
        supportAllValues: true,
      },
      heading: {
        options: [
        {
          model: "paragraph",
          title: "Paragraph",
          class: "ck-heading_paragraph",
        },
        {
          model: "heading1",
          view: "h1",
          title: "Heading 1",
          class: "ck-heading_heading1",
        },
        {
          model: "heading2",
          view: "h2",
          title: "Heading 2",
          class: "ck-heading_heading2",
        },
        {
          model: "heading3",
          view: "h3",
          title: "Heading 3",
          class: "ck-heading_heading3",
        },
        {
          model: "heading4",
          view: "h4",
          title: "Heading 4",
          class: "ck-heading_heading4",
        },
        {
          model: "heading5",
          view: "h5",
          title: "Heading 5",
          class: "ck-heading_heading5",
        },
        {
          model: "heading6",
          view: "h6",
          title: "Heading 6",
          class: "ck-heading_heading6",
        },
        ],
      },
      htmlSupportConfig : {
        allow: [
        {
          name: 'div',
          classes: true,
          styles: true,
          attributes: {
            id: true,
            'data-unique': {
              required: false
            }
          },
        }
        ],
        disallow: []
      },
      initialData: `${fileData.content}`,
      licenseKey: LICENSE_KEY,
      link: {
        addTargetToExternalLinks: true,
        defaultProtocol: "https://",
        decorators: {
        toggleDownloadable: {
          mode: "manual",
          label: "Downloadable",
          attributes: {
          download: "file",
          },
        },
        },
      },
      menuBar: {
        isVisible: true,
      },
      placeholder: "Type or paste your content here!",
      table: {
        contentToolbar: [
        "tableColumn",
        "tableRow",
        "mergeTableCells",
        "tableProperties",
        "tableCellProperties",
        ],
      },
      },

    };
  }, [isLayoutReady]);

  return (
    <div className="main-container">
      <div
        className="editor-container editor-container_document-editor editor-container_include-word-count"
        ref={editorContainerRef}
      >
        <S.WriteHeader>
          <p className="title">{fileData.title}</p>
          <div className="editor-container__menu-bar" ref={editorMenuBarRef}></div>
        </S.WriteHeader>
        <div className="editor-container__toolbar" ref={editorToolbarRef}></div>
        <div className="editor-container__editor-wrapper">
          <div className="editor-container__editor">
            <div ref={editorRef}>
              {editorConfig && (
                <CKEditor
                  onReady={(editor) => {
                    // 에디터 인스턴스 저장
                    editorRef.current.instance = editor;
                    const wordCount = editor.plugins.get("WordCount");
                    editorWordCountRef.current.appendChild(wordCount.wordCountContainer);
                    editorToolbarRef.current.appendChild(editor.ui.view.toolbar.element);
                    editorMenuBarRef.current.appendChild(editor.ui.view.menuBarView.element);
                  }}
                  onAfterDestroy={() => {
                    Array.from(editorWordCountRef.current.children).forEach((child) =>
                      child.remove()
                    );
                    Array.from(editorToolbarRef.current.children).forEach((child) =>
                      child.remove()
                    );
                    Array.from(editorMenuBarRef.current.children).forEach((child) =>
                      child.remove()
                    );
                  }}
                  editor={DecoupledEditor}
                  config={editorConfig}
                  onChange={(event, editor: DecoupledEditor) => {
                    // 타이머 재시작
                    timerRef.current.stop();
                    timerRef.current.start(3000);
                  }}
                />
              )}
            </div>
          </div>
        </div>
        <div className="editor_container__word-count" ref={editorWordCountRef}></div>
      </div>
    </div>
  );
}
