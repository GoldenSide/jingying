<template>
  <div>
    <Editor
      ref="eidtor"
      :id="Id"
      v-model="tinymceHtml"
      :init="DefaultConfig"
    ></Editor>
  </div>
</template>
<script>
import axios from "axios";
import tinymce from "tinymce/tinymce";
import "tinymce/themes/modern/theme";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/plugins/paste";
import "tinymce/plugins/importcss";
import "tinymce/plugins/image";
import "tinymce/plugins/code";
import "tinymce/plugins/table";
import "tinymce/plugins/advlist";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/link";
import "tinymce/plugins/media";
import "tinymce/plugins/lists";
import "tinymce/plugins/textcolor";
import "tinymce/plugins/colorpicker";
import "tinymce/plugins/hr";
import "tinymce/plugins/preview";
import "tinymce/plugins/wordcount";
import { baseUrl } from "@/config/http";
export default {
  name: "mceeditor",
  data() {
    const Id = "editor" + Date.now();
    return {
      Id: Id,
      tinymceHtml: "",
      Editor: null,
      DefaultConfig: {
        // GLOBAL
        setup: (editor) => {
          editor.on("input change undo redo", () => {
            console.log(editor.getContent());
            this.$emit("change", editor.getContent());
          });
        },
        language_url: "/static/tinymce/zh_CN.js",
        language: "zh_CN",
        skin_url: "/static/tinymce/skins/lightgray",
        min_height: 240,
        autoresize_max_height: 500,
        branding: false,
        menubar: false,
        toolbar: `styleselect | fontselect | formatselect | fontsizeselect | forecolor backcolor | bold italic underline strikethrough | image | media | table | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist |  removeformat  hr | paste code  link | undo redo | fullscreen preview`,
        plugins: `
            wordcount
            paste
            importcss
            image
            code
            table
            advlist
            fullscreen
            link
            media
            lists
            textcolor
            colorpicker
            hr
            preview
            autoresize
          `,
        // CONFIG

        forced_root_block: "",
        // force_p_newlines: true,
        importcss_append: true,

        // CONFIG: ContentStyle 这块很重要， 在最后呈现的页面也要写入这个基本样式保证前后一致， `table`和`img`的问题基本就靠这个来填坑了
        // content_style: `
        //     *                         { padding:0; margin:0; }
        //     html, body                { height:100%; }
        //     img                       { max-width:100%; display:block;height:auto; }
        //     a                         { text-decoration: none; }
        //     iframe                    { width: 100%; }
        //     p                         { line-height:1.6; margin: 0px; }
        //     table                     { word-wrap:break-word; word-break:break-all; max-width:100%; border:none; border-color:#999; }
        //     .mce-object-iframe        { width:100%; box-sizing:border-box; margin:0; padding:0; }
        //     ul,ol                     { list-style-position:inside; }
        // `,
        content_style: `
            ul,ol      {padding-left:40px}
            img ,audio                { max-width:100%; display:block;height:auto;margin:0 auto }
            iframe                    { width: 100%; }
            p                         {  margin: 0px;padding:0 }
            table                     { word-wrap:break-word; word-break:break-all; max-width:100%; border:none; border-color:#999; }
            .mce-object-iframe        { width:100%; box-sizing:border-box; margin:0; padding:0; }
          `,

        insert_button_items: "image link | inserttable",

        // CONFIG: Paste
        // paste_retain_style_properties: "all",
        // paste_word_valid_elements: "*[*]", // word需要它
        paste_data_images: true, // 粘贴的同时能把内容里的图片自动上传，非常强力的功能
        paste_convert_word_fake_lists: false, // 插入word文档需要该属性
        // paste_webkit_styles: "all",
        // paste_merge_formats: false,
        // nonbreaking_force_tab: false,
        paste_auto_cleanup_on_paste: true,
        paste_remove_styles: true,
        paste_remove_styles_if_webkit: true,
        paste_strip_class_attributes: true,

        // CONFIG: Font
        fontsize_formats: "12px 14px 16px 18px 20px 24px 32px 48px",

        // CONFIG: StyleSelect
        style_formats: [
          {
            title: "首行缩进",
            block: "p",
            styles: { "text-indent": "2em" },
          },
          {
            title: "行高",
            items: [
              { title: "1", styles: { "line-height": "1" }, inline: "span" },
              {
                title: "1.5",
                styles: { "line-height": "1.5" },
                inline: "span",
              },
              { title: "2", styles: { "line-height": "2" }, inline: "span" },
              {
                title: "2.5",
                styles: { "line-height": "2.5" },
                inline: "span",
              },
              { title: "3", styles: { "line-height": "3" }, inline: "span" },
            ],
          },
        ],

        // FontSelect
        font_formats: `
            微软雅黑=微软雅黑;
            宋体=宋体;
            黑体=黑体;
            仿宋=仿宋;
            楷体=楷体;
            隶书=隶书;
            幼圆=幼圆;
            Andale Mono=andale mono,times;
            Arial=arial, helvetica,
            sans-serif;
            Arial Black=arial black, avant garde;
            Book Antiqua=book antiqua,palatino;
            Comic Sans MS=comic sans ms,sans-serif;
            Courier New=courier new,courier;
            Georgia=georgia,palatino;
            Helvetica=helvetica;
            Impact=impact,chicago;
            Symbol=symbol;
            Tahoma=tahoma,arial,helvetica,sans-serif;
            Terminal=terminal,monaco;
            Times New Roman=times new roman,times;
            Trebuchet MS=trebuchet ms,geneva;
            Verdana=verdana,geneva;
            Webdings=webdings;
            Wingdings=wingdings,zapf dingbats`,

        // Tab
        tabfocus_elements: ":prev,:next",
        object_resizing: true,

        // Image
        imagetools_toolbar:
          "rotateleft rotateright | flipv fliph | editimage imageoptions",
        images_upload_handler: (blobInfo, success, failure) => {
          console.log(blobInfo.blob().type);
          if (blobInfo.blob().size / 1024 > this.maxSize) {
            failure(
              `图片(${(blobInfo.blob().size / 1024).toFixed(2)}KB)超过20480KB！`
            );
          }
          if (this.accept.indexOf(blobInfo.blob().type) > -1) {
            uploadPic.call(this);
          } else {
            failure("图片格式错误");
          }
          function uploadPic() {
            let formData = new FormData();
            formData.append(`file[]`, blobInfo.blob());
            axios
              .post(baseUrl + "/sail/upload/file", formData, {
                timeout: 60000,
              })
              .then((res) => {
                if (res.data.code == 0) {
                  success(res.data.data[0].file_preview);
                } else if (res.data.code == 10) {
                  this.$message.error("登录失效！");
                  setTimeout(() => {
                    this.$router.push("/login");
                  }, 1000);
                } else {
                  failure("上传失败");
                }
              })
              .catch((err) => {
                failure("上传失败");
              });
          }
        },
      },
    };
  },
  props: {
    id: {
      type: [Number, String],
      default: Date.now(),
    },
    value: {
      default: "",
      type: String,
    },
    config: {
      type: Object,
      default: () => {
        return {
          theme: "modern",
          height: 300,
        };
      },
    },
    url: {
      default: "",
      type: String,
    },
    accept: {
      default: "image/jpeg,image/png,image/jpg,image/png,image/gif",
      type: String,
    },
    maxSize: {
      default: 20480,
      type: Number,
    },
    withCredentials: {
      default: false,
      type: Boolean,
    },
  },
  mounted() {
    
    this.tinymceHtml = this.value;
    this.init();
    let container = document.getElementsByClassName("node-right-centent");
    if (container.length) {
      container[0].onscroll = function (e) {
        if ([...document.getElementsByClassName("mce-floatpanel")].length > 0) {
          document.body.click();
        }
      };
    }
    window.onscroll = function () {
      console.log(2);
    };
  },
  beforeDestroy() {
    // 销毁tinymce
    this.$emit("on-destroy");
    tinymce.remove(this.$refs.Editor);
  },
  methods: {
    init() {
      // const self = this
      // this.Editor = window.tinymce.init({
      //   ...this.DefaultConfig,
      //   selector: `#${this.Id}`,
      // })
    },
  },
  components: {
    Editor,
  },
};
</script>
<style lang="scss">
.mce-panel {
  box-sizing: border-box;
  border-radius: 4px;
  overflow: hidden;
}
div.mce-edit-area {
  border-radius: 0;
}
.mce-tinymce {
  box-shadow: none;
}
.mce-btn-group:not(:first-child) {
  border: none !important;
}
div.mce-fullscreen {
  z-index: 2011;
}
</style>
