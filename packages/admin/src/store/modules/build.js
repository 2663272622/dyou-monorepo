import {getEvaluate, updateEvaluate, addEvaluate} from "@/api/teaching/build";

const useEvaluateStore = defineStore(
    'evaluate',
    {
        state: () => ({
            form: {
                assessmentName: '',
                startTime: '',
                endTime: '',
                examinationTime: null,
                catalogIdList: [],
                courseClassIdList: [],
                courseId: null,
                bookId: null,
                assessType: null,
                bankQuestionList: [],
                questionList:[]
            },
            activeStep: 0,
            pathParameter: {
                assessmentId: null,
            },
        }),
        actions: {
            // 设置测评的id
            setAssessmentId(id) {
                this.pathParameter.assessmentId = id;
            },
            // 设置步数
            setActiveStep(activeStep) {
                this.activeStep = activeStep;
            },
            getEvaluateInfo() {
                return new Promise((resolve, reject) => {
                    getEvaluate(this.pathParameter.assessmentId).then(res => {
                        this.form = res.data
                        resolve()
                    }).catch(error => {
                        reject(error)
                    })
                })
            },
            saveEvaluation() {
                var obj = this.constructEvaluationObject()
                if (this.pathParameter.assessmentId) {
                    obj['assessmentId'] = this.pathParameter.assessmentId
                    console.log(obj)
                    return updateEvaluate(obj);
                } else {
                    return addEvaluate(obj);
                }
            },
            constructEvaluationObject() {
                return {
                    assessmentName: this.form.assessmentName,
                    startTime: this.form.startTime,
                    endTime:this.form.endTime,
                    examinationTime: this.form.examinationTime,
                    catalogIdList: this.form.catalogIdList,
                    courseClassIdList: this.form.courseClassIdList,
                    courseId: this.form.courseId,
                    bookId: this.form.bookId,
                    assessType: this.form.assessType,
                    questionList:this.form.questionList,
                    ...(this.pathParameter.assessmentId && { assessmentId: this.pathParameter.assessmentId }),
                };
            },
            resetForm() {
                this.form = {
                    assessmentName: '',
                    startTime: '',
                    endTime: '',
                    examinationTime: null,
                    catalogIdList: [],
                    courseClassIdList: [],
                    courseId: null,
                    bookId: null,
                    assessType: null,
                    bankQuestionList: [],
                    questionList:[]
                };
            },
        }
    })

export default useEvaluateStore
