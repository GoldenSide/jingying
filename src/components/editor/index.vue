<template>
  <div class="editor-contianer" style="min-height: 161px">
    <textarea
      class="textarea"
      ref="eidtor"
      :id="Id"
      :toolbar="toolbar"
      maxlength="200"
      style="width: 100%; height: 260px"
      :init="DefaultConfig"
    ></textarea>
    <img
      v-if="maxImg"
      :src="require('./img/init-load.jpg')"
      alt
      v-show="loading"
      class="init-img init-load-img"
    />
    <img
      v-else
      :src="require('./img/init.jpg')"
      alt
      v-show="loading"
      class="init-img"
    />
  </div>
</template>
<script>
import OSS from "ali-oss";
import SparkMD5 from "spark-md5";
import ossMixIn from "@/mixins/ossMixin";
export default {
  name: "mceeditor",
  components: {},
  mixins: [ossMixIn],
  props: {
    id: {
      type: [Number, String],
      default: Date.now(),
    },
    toolbar: {
      type: [String],
      default:
        " `styleselect  | formatselect|forecolor backcolor | bold italic underline |strikethrough | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist   | removeformat  hr |code  link | undo redo | fullscreen preview |image | media | table|parse code  link`",
    },
    filterClass: {
      type: Boolean,
      default: true,
    },
    config: {
      type: Object,
      default() {
        return {};
      },
    },
    value: {
      default: "",
      type: String,
    },
    url: {
      default: "",
      type: String,
    },
    accept: {
      default: "image/jpeg,image/png,image/jpg,image/png,image/gif",
      type: String,
    },
    maxImgSize: {
      default: 81920000,
      type: Number,
    },
    withCredentials: {
      default: false,
      type: Boolean,
    },
    maxImg: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  watch: {
    value: {
      immediate: true,
      deep: true,
      handler(val) {
        this.tinymceHtml = val;
      },
    },
  },
  data() {
    const Id = "editor" + Date.now();
    return {
      Id: Id,
      tinymceHtml: "",
      loading: true,
      loadingText: "组件初始化...",
      DefaultConfig: {
        // GLOBAL
        setup: (editor) => {
          editor.on("input change undo redo", () => {
            let content = editor.getContent();

            // 如果过滤class 参数为 true 则过滤class
            if (this.filterClass) {
              let classReg = /<(.*?)(class=[\"|\'].*?[\"|\'])(.*?)>/gi;
              content = content.replace(classReg, "<$1 $3>");
            }

            let videoReg = /(<p.*?>)?(<iframe(.*?)><\/iframe>)(<\/p>)?/gi;
            content = content.replace(videoReg, (...args) => {
              return `<p class="video-wrapper">${args[2]}</p>`;
            });
            // this.$emit('input',editor.getContent())
            this.$emit("input", content);
          });
          editor.on("init", () => {
            this.loading = false;
            if (this.tinymceHtml) {
              editor.setContent(this.tinymceHtml);
            } else {
              setTimeout(() => {
                editor.setContent(this.tinymceHtml);
              }, 100);
            }
          });
        },

        language_url: "/static/lib/tinymce/zh_CN.js",
        language: "zh_CN",
        skin_url: "/static/lib/tinymce/skins/lightgray",
        autoresize_min_height: 240,
        autoresize_max_height: 500,
        branding: false,
        menubar: false,
        //  image | media | table|parse code  link   styleselect  | formatselect | strikethrough | removeformat  hr |code  link | undo redo | fullscreen preview
        //  ` forecolor backcolor | bold italic underline  | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist `
        toolbar: ` forecolor backcolor | bold italic underline  | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist  |code  link `,
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
            advlist
          `,
        // CONFIG
        forced_root_block: "",
        force_p_newlines: true,
        importcss_append: true,
        content_style: `
                    body                      {font-family:Helvetica Neue, Helvetica, Arial, sans-serif;}
                    img ,audio                { max-width:100%;  }
                    iframe                    { width: 100%; }
                    table                     { word-wrap:break-word; word-break:break-all; max-width:100%; border:none; border-color:#999; }
                    .mce-object-iframe        { width:100%; box-sizing:border-box; margin:0; padding:0; }
                `,
        insert_button_items: "image link | inserttable",
        paste_data_images: true, // 粘贴的同时能把内容里的图片自动上传，非常强力的功能
        paste_convert_word_fake_lists: false, // 插入word文档需要该属性
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
              {
                title: "1",
                styles: { "line-height": "1" },
                inline: "span",
              },
              {
                title: "1.5",
                styles: { "line-height": "1.5" },
                inline: "span",
              },
              {
                title: "2",
                styles: { "line-height": "2" },
                inline: "span",
              },
              {
                title: "2.5",
                styles: { "line-height": "2.5" },
                inline: "span",
              },
              {
                title: "3",
                styles: { "line-height": "3" },
                inline: "span",
              },
            ],
          },
        ],
        tabfocus_elements: ":prev,:next",
        object_resizing: true,

        // Image
        imagetools_toolbar:
          "rotateleft rotateright | flipv fliph | editimage imageoptions",
        images_upload_handler: (blobInfo, success, failure) => {
          let file = new window.File([blobInfo.blob()], blobInfo.blob().name);
          if (file.size / 1024 > this.maxImgSize) {
            failure(
              `您的图片尺寸过大，会影响买家的访问速度，请使用${
                this.maxImgSize / 1024
              }M以下大小的图片`
            );
          }

          if (this.accept.indexOf(file.type) > -1) {
            uploadPic.call(this);
          } else {
            failure("图片格式错误");
          }
          async function uploadPic() {
            //读取文件MD5值
            let MD5 = await this.get_filemd5sum(file);
            if (MD5) {
              this.uploadToOss(file, MD5)
                .then((res) => {
                  success(res.file_preview);
                })
                .catch((err) => {
                  this.$message.error(err);
                });
            }
          }
        },
      },
    };
  },
  computed: {},
  mounted() {
    this.init();
    let container = document.getElementsByClassName("node-right-centent");
    if (container.length) {
      container[0].onscroll = function (e) {
        if ([...document.getElementsByClassName("mce-floatpanel")].length > 0) {
          document.body.click();
        }
      };
    }
    this.$nextTick(() => {
      if (this.config.isEditAble === false) {
        let tout = setInterval(() => {
          if (document.getElementsByTagName("iframe")[0]) {
            clearInterval(tout);
            let div = document.createElement("div");
            div.setAttribute(
              "style",
              "width: 100%;height:100%;background: rgba(255,255,255,0.25);position: fixed;top: 0px;cursor: not-allowed;"
            );
            setTimeout(() => {
              document
                .getElementsByTagName("iframe")[0]
                .contentWindow.document.body.appendChild(div);
            }, 500);
          }
        }, 300);
      }
    });
  },
  beforeDestroy() {
    //解决离开包含editor的页面时闪烁html代码段问题
    if (document.querySelector(".editor-contianer")) {
      document.querySelector(".editor-contianer").style.visibility = "hidden";
    }
  },
  methods: {
    init() {
      let config = {
        ...this.DefaultConfig,
        selector: `#${this.Id}`,
      };
      if (this.tinymceHtml !== null && this.tinymceHtml !== "") {
        tinymce.init(config);
      } else {
        setTimeout(() => {
          tinymce.init(config);
        }, 1000);
      }
    },
    get_filemd5sum(ofile) {
      return new Promise((resolve, reject) => {
        let file = ofile;
        let tmp_md5;
        let blobSlice =
            File.prototype.slice ||
            File.prototype.mozSlice ||
            File.prototype.webkitSlice,
          chunkSize = 8097152, // Read in chunks of 2MB
          chunks = Math.ceil(file.size / chunkSize),
          currentChunk = 0,
          spark = new SparkMD5.ArrayBuffer(),
          fileReader = new FileReader();
        fileReader.onload = async (e) => {
          spark.append(e.target.result); // Append array buffer
          currentChunk++;
          let md5_progress = Math.floor((currentChunk / chunks) * 100);
          if (currentChunk < chunks) {
            loadNext();
          } else {
            tmp_md5 = spark.end();
            resolve(tmp_md5);
          }
        };
        fileReader.onerror = function () {
          reject(false);
        };
        function loadNext() {
          let start = currentChunk * chunkSize,
            end =
              start + chunkSize >= file.size ? file.size : start + chunkSize;
          fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
        }
        loadNext(tmp_md5);
      });
    },
    //与后台MD5进行对比，是否上传过，上传过返回存在的图片
    async queryExsit(MD5) {
      return false;
    },
    uploadToOss(file, MD5) {
      return new Promise((resolve, reject) => {
        let str = "",
          url = "",
          client = null,
          fileName = null,
          suffix = null,
          index = 0;
        this.initOssConfig().then((res) => {
          if (res && Object.keys(res).length > 0) {
            client = new OSS(res);
            suffix = file.name.split(".")[file.name.split(".").length - 1];
            fileName =
              SparkMD5.hash(new Date().getTime() + file.name) + "." + suffix;
            client
              .multipartUpload("uploader/" + fileName, file, {}, {})
              .then((data) => {
                if (data.res.requestUrls.length) {
                  str = data.res.requestUrls[0];
                  index = str.indexOf("?");
                  url = index > 0 ? str.substring(0, index) : str;
                  resolve({ file_preview: url });
                }
                reject("上传失败");
              });
          } else {
            this.$message.error("获取oss秘钥失败，请刷新重试");
          }
        });
      });
    },
    //单个上传
    async upload(index) {
      this.$set(this.files[index], "success", "uploading");
      //读取文件MD5值
      let MD5 = await this.get_filemd5sum(this.files[index].data);
      if (MD5) {
        // let img = await this.queryExsit(MD5);
        let img = false;
        if (img) {
          //如果已经上传
          this.$set(this.files, index, img);
          this.$emit("input", this.files);
        } else {
          //没有上传过
          let imgObj = await this.uploadToOss(this.files[index].data, MD5);
          if (imgObj) {
            this.$set(this.files, index, imgObj);
            this.$emit("input", this.files);
          } else {
            this.$set(this.files[index], "success", "fail");
            this.$emit("input", this.files);
          }
        }
      }
    },
  },
};
</script>
<style lang="scss">
.mce-panel {
  box-sizing: border-box;
  border-radius: 4px;
  overflow: hidden;
}
.editor-contianer {
  position: relative;
  .init-img {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
  }
  .init-load-img {
    max-width: 100%;
  }
}
.editor-contianer .el-loading-text {
  color: #1a1d2c;
}
div.mce-edit-area {
  border-radius: 0;
  overflow-y: scroll;
}
.mce-tinymce {
  box-shadow: none;
  box-sizing: border-box !important;
}
.mce-btn-group:not(:first-child) {
  border: none !important;
}
div.mce-fullscreen {
  z-index: 2011;
}
// .mce-container {
//   max-height: 350px;
// }
</style>

