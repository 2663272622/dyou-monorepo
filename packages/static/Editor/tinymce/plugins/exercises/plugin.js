(function () {
  'use strict';

  var global = tinymce.util.Tools.resolve('tinymce.PluginManager');
  const baseURL = window.VUE_APP_API_URL;
  var bookid = window.bookid

  var fetchQuestions = function (selectedLibraries) {
    return new Promise(function (resolve, reject) {
      var catalogid = window.sessionStorage.getItem('catalogid')
      const params = {
        bookid: bookid,
        catalogid: catalogid,
        banktypelist: selectedLibraries
      };
      catalogid = window.sessionStorage.getItem('catalogid')
      const query = new URLSearchParams(params).toString();
      const token = localStorage.getItem('token');

      fetch(`${baseURL}system/teacherquestionbank/queryExamQuestionlist?${query}`, {
        method: 'GET',
        headers: {
          Authorization: "Bearer " + token
        },
      })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            if (data && Array.isArray(data.data)) {
              resolve(data.data); // 解析返回的 data 数组
            } else {
              reject(new Error('Invalid data structure'));
            }
          })
          .catch(error => {
            reject(error);
          });
    });
  };
  var fetchQuestions1 = function (selectedLibraries,selectedQuestionTypes) {
    return new Promise(function (resolve, reject) {
      var catalogid = window.sessionStorage.getItem('catalogid')
      const params = {
        catalogid: catalogid,
        bookid: bookid,
        banktypelist: selectedLibraries,
        questionlist: JSON.stringify(selectedQuestionTypes)
      };
      const query = new URLSearchParams(params).toString();
      const token = localStorage.getItem('token');

      fetch(`${baseURL}system/examManage/queryQuestionsList?${query}`, {
        method: 'GET',
        headers: {
          Authorization: "Bearer " + token
        },
      })
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            if (data && Array.isArray(data.data)) {
              resolve(data.data); // 解析返回的 data 数组
            } else {
              reject(new Error('Invalid data structure'));
            }
          })
          .catch(error => {
            reject(error);
          });
    });
  };
  var submitQuestions = function (id,selectedQuestionIds) {
    return new Promise(function (resolve, reject) {
      const data =[]
      var catalogid = window.sessionStorage.getItem('catalogid')
      for (var i=0;i<selectedQuestionIds.length;i++){
        data.push({catalogid: catalogid,bookid:bookid, id: id,questionid: selectedQuestionIds[i]})
      }

      const token = localStorage.getItem('token');
      fetch(`${baseURL}system/bookExercises/insert`, {
        method: 'POST',
        headers: {
          Authorization: "Bearer " + token
        },
        body:JSON.stringify(data)
      }).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      }).then(data => {
        if (data) {
          resolve(data); // 解析返回的 data 数组
        } else {
          reject(new Error('Invalid data structure'));
        }
      }).catch(error => {
        reject(error);
      });
    });
  };
  // 生成唯一的id
  var generateUUID = function() {
    let dt = new Date().getTime();

    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });

    return uuid;
  }
  var createExercisesContent = function (data) {
    return `
      <div class="exercises" data-id="${data.id}" contenteditable="false" style="border: 2px solid transparent;">
       <div class="exercises-container"
              style="display: flex;
              align-items: center;
              height: 6em;
              padding: 10px;
              border-radius: 10px;
              font-size: 19px;
              border: 3px solid #000;">
         <div class="extended_left"
              style="width: 90px;
              height: 90px;
              background: #000;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 10px;
              clip-path: polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px));">
          <img class="exercises_left_icon" src="https://cos.dyjiaoyu.com/icon/exercises.png">
         </div>
         <div class="exercises-text-container"
                style="position: relative;
                width: calc(100% - 100px);
                background: ${data.backgroundColor};
                height: 100%;
                margin: 10px 0 10px 10px;
                clip-path: polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px));">
           <div class="exercises_middle_content"
                style="font-size: 1.2em;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: center;
                height: 100%;
                margin: 0 3.6rem 0 1.375rem;">
             <div class="exercises_middle_type"
             style="height: 30px;
              letter-spacing: 5px;
              line-height: 30px;
              color: #000;
              font-size: 19px;
              font-weight: bold;
              text-align: left;
              border-bottom: 2px solid;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;">${data.title}</div>
             <div class="exercises_middle_title"
                style="width: 100%;
                height: 30px;
                line-height: 30px;
                font-size: 16px;
                color: #000;
                text-align: left;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;">
                 <div style="white-space: nowrap; width: fit-content;"></div>
             </div>
           </div>
           <div class="exercises_middle_icon" style="position: absolute;
                  right: 20px;
                  top: 50%;
                  transform: translateY(-50%);
                  width: 35px;
                  height: 35px;
                ">
           <img src="https://cos.dyjiaoyu.com/icon/play.png">
           </div>
         </div>
       </div>
     </div>
    `;
  };
  var openQuizDialog = function (editor) {
    editor.windowManager.open({
      title: '插入练习题',
      size: 'large',
      body: {
        type: 'panel',
        items: [
          {
            type: 'input',
            name: 'title',
            label: '练习题标题：'
          },
          {
            type: 'colorinput',
            name: 'backgroundColor',
            label: '背景颜色',
          },
          {
            type: 'htmlpanel',
            html: `
              <div id="questionContainer"></div>
            `
          },
          {
            type: 'htmlpanel',
            html: `
              <div id="questionList" style="max-height: 200px; overflow-y: auto; padding: 5px;"></div>
            `
          },
        ]
      },
      buttons: [
        {
          type: 'cancel',
          name: 'cancel',
          text: '取消'
        },
        {
          type: 'submit',
          name: 'save',
          text: '保存',
          primary: true
        }
      ],
      onSubmit: function (api) {
        const data = api.getData()
        const title = data.title
        const backgroundColor = data.backgroundColor
        if (title == ''){
          alert('请填写标题！');
          return;
        }
        // 获取选中的题目 ID
        const selectedQuestionIDs = Array.from(document.querySelectorAll('#questionList input[type="checkbox"]:checked')).map(input => input.value);
        if (selectedQuestionIDs.length === 0) {
          alert('请先选择题目！');
          return;
        }
        const id = generateUUID()
        // 提交问题
        submitQuestions(id, selectedQuestionIDs)
            .then(response => {
              if(response.code == 200){
                var data1 = {title:title,id:id,backgroundColor:backgroundColor}
                const content = createExercisesContent(data1)
                editor.insertContent(content);
              }
              api.close(); // 关闭对话框
            })
            .catch(error => {
              alert('提交失败，请稍后再试。'+error);
            });
        // api.close();
      }
    });
    fetchQuestionsOnChange()
  };

  function fetchQuestionsOnChange() {
    const selectedLibraries = ['3'];

    if (selectedLibraries.length === 0) {
      document.getElementById('questionContainer').innerHTML = ''; // 清空问题容器
      return;
    }

    fetchQuestions(selectedLibraries).then(function (questions) {
      if (questions.length == 0){
        alert('暂无题型，请先去题库中添加题！');
      }
      const questionContainer = document.getElementById('questionContainer');
      // 创建标签和按钮的 HTML
      const label = '<div>题型</div>';
      const button = `
        <p>
            <button id="getQuestionsButton" style="border: 1px solid #dee6ef; padding: 5px; background: #409eff; font-size: 15px; border-radius: 5px; color: #f8f2f2">
                获取题目
            </button>
        </p>`;

      // 更新 questionContainer 的内容
      questionContainer.innerHTML = label + questions.map(q => `
        <div style="margin: 10px 0;">
            <input type="checkbox" name="${q.questiontype}" value="${q.questiontype}" id="question_${q.questiontype}">
            <label for="question_${q.questiontype}">${q.questiontype2}</label>
        </div>
    `).join('') + button;

      // 获取按钮元素
      const questionText = document.getElementById('getQuestionsButton');

      // 根据 questions 数组的长度控制按钮的显示
      if (questions.length === 0) {
        questionText.style.display = 'none'; // 隐藏按钮
      } else {
        questionText.style.display = 'block'; // 显示按钮
      }


      // 绑定获取题目按钮点击事件
      document.getElementById('getQuestionsButton').onclick = function () {
        const selectedQuestionTypes = Array.from(document.querySelectorAll('#questionContainer input[type="checkbox"]:checked')).map(input => ({
          questiontype: input.value,
          type: input.nextElementSibling.textContent
        }));
        if (selectedQuestionTypes.length === 0) {
          alert('请先选择题型！');
          return;
        }
        // 更新问题显示的函数
        function updateQuestions() {
          questionContainer.innerHTML = label + questions.map(q => `
            <div style="margin: 10px 0;">
                <input type="checkbox" name="${q.questiontype}" value="${q.questiontype}" id="question_${q.questiontype}">
                <label for="question_${q.questiontype}">${q.questiontype2}</label>
            </div>
        `).join('') + button;

          // 重新获取按钮元素
          const questionText = document.getElementById('getQuestionsButton');

          // 根据 questions 数组的长度控制按钮的显示
          if (questions.length === 0) {
            questionText.style.display = 'none'; // 隐藏按钮
          } else {
            questionText.style.display = 'block'; // 显示按钮
          }
        }
        fetchQuestions1(selectedLibraries,selectedQuestionTypes).then(function (fetchedQuestions) {
          const questionContainer = document.getElementById('questionContainer');
          const tableHeader = `
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr>
              <th style="border: 1px solid #dee6ef; padding: 8px;"></th>
              <th style="border: 1px solid #dee6ef; padding: 8px;">类型</th>
               <th style="border: 1px solid #dee6ef; padding: 8px;">题目</th>
            </tr>
          </thead>
          <tbody>
      `;
          const tableRows = fetchedQuestions.map(q => `
        <tr>
          <td style="border: 1px solid #dee6ef; padding: 8px;">
            <input type="checkbox" value="${q.id}" id="question_${q.id}">
          </td>
           <td style="border: 1px solid #dee6ef; padding: 8px;">${q.questiontype2}</td>
          <td style="border: 1px solid #dee6ef; padding: 8px;">${q.questioncontent}</td>
        </tr>
      `).join('');
          const tableFooter = `
          </tbody>
        </table>
      `;

          questionList.innerHTML = tableHeader + tableRows + tableFooter;
        }).catch(function (error) {
          console.error('Error fetching questions:', error);
          alert('获取题目失败，请稍后再试。');
        });
      };
    }).catch(function (error) {
      console.error('Error fetching questions:', error);
      alert('获取题目失败，请稍后再试。');
    });
  }


  var register = function (editor) {
    editor.addCommand('exercises', function () {
      openQuizDialog(editor);
    });
  };

  var registerUI = function (editor) {
    editor.ui.registry.addButton('exercises', {
      icon: 'exercises',
      tooltip: '插入练习题',
      onAction: function () {
        return openQuizDialog(editor);
      }
    });
  };

  function Plugin() {
    global.add('exercises', function (editor) {
      register(editor);
      registerUI(editor);
      return {};
    });
  }

  Plugin();

}());
