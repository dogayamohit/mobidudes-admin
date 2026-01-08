import { useState } from "react";
import PageBreadCrumb from "../../components/common/PageBreadCrumb";
import QuillTextEditor from "../../components/editor/QuillTextEditor";
import ComponentCard from "../../components/common/ComponentCard";
import CKTextEditor from "../../components/editor/CKTextEditor";

export default function TextEditor() {
    const [ckContent, setCKContent] = useState("");
    const [quillContent, setQuillContent] = useState("");

    return (
        <>

            <PageBreadCrumb pageTitle="Editor" />
            <div className="xxl:max-w-3xl mx-auto p-6">

                <ComponentCard title={"CK Text Editor"}>

                    <CKTextEditor
                        value={ckContent}
                        onChange={setCKContent}
                        placeholder="Write your article..."
                    />

                    <pre className="rounded-lg bg-gray-100 p-3 text-sm">
                        {ckContent}
                    </pre>
                </ComponentCard>

                <ComponentCard title={"Quill Text Editor"}>

                    <QuillTextEditor
                        label="Description"
                        value={quillContent}
                        onChange={setQuillContent}
                        placeholder="Write your article..."
                    />

                    <pre className="mt-6 rounded-lg bg-gray-100 p-4 text-xs">
                        {quillContent}
                    </pre>
                </ComponentCard>

            </div>
        </>
    );
}
