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
            },
            activeStep: 0,
            pathParameter: {
                assessmentId: null,
            },
            questionList:[]
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
                        console.log(res.data)
                        resolve()
                    }).catch(error => {
                        reject(error)
                    })
                })
            },
            saveEvaluation() {
                console.log(111)
                if (this.pathParameter.assessmentId) {
                    return updateEvaluate(this.pathParameter.assessmentId, ...this.form);
                } else {
                    return addEvaluate(...this.form);
                }
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
                };
            },
        }
    })

export default useEvaluateStore
