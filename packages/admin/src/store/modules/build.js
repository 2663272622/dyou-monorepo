import { getEvaluate, updateEvaluate, addEvaluate } from "@/api/teaching/build";
import { defineStore } from 'pinia';

const useEvaluateStore = defineStore('evaluate', {
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
            questionList: []
        },
        activeStep: 0,
        pathParameter: {
            assessmentId: null,
        },
    }),
    actions: {
        setAssessmentId(id) {
            this.pathParameter.assessmentId = id;
        },
        setActiveStep(activeStep) {
            this.activeStep = activeStep;
        },
        async getEvaluateInfo() {
            try {
                const res = await getEvaluate(this.pathParameter.assessmentId);
                this.form = res.data;
            } catch (error) {
                console.error("Error fetching evaluation info:", error);
                throw error; // Handle further up the call stack
            }
        },
        async saveEvaluation() {
            const obj = this.constructEvaluationObject();
            if (this.pathParameter.assessmentId) {
                // obj['assessmentId'] = this.pathParameter.assessmentId;
                console.log(obj);
                return updateEvaluate(obj);
            } else {
                return addEvaluate(obj);
            }
        },
        constructEvaluationObject() {
            return {
                assessmentName: this.form.assessmentName,
                startTime: this.form.startTime,
                endTime: this.form.endTime,
                examinationTime: this.form.examinationTime,
                catalogIdList: this.form.catalogIdList,
                courseClassIdList: this.form.courseClassIdList,
                courseId: this.form.courseId,
                bookId: this.form.bookId,
                assessType: this.form.assessType,
                questionList: this.form.questionList,
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
                questionList: []
            };
        },
    },
    getters: {
        TypeTitle: (state) => {
            return state.form.assessType == 1
                ? "考试"
                : state.form.assessType == 2
                    ? "作业"
                    : "测评";
        }
    },
});

export default useEvaluateStore;