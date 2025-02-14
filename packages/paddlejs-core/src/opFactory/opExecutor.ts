/**
 * @file OpExecutor，封装算子可执行单元
 */

import { ModelOp, OpInputs, OpOutputs, OpAttrs, OpData, BufferType, OpUniform } from '../commons/interface';
import { GLOBALS } from '../globals';

export default class OpExecutor {
    id: string = '';
    type: string = '';
    inputs: OpInputs = {} as OpInputs;
    outputs: OpOutputs = {} as OpOutputs;
    attrs: OpAttrs = {} as OpAttrs;
    subAttrs: OpAttrs[] = [] as OpAttrs[];
    next: string = '';
    opData: OpData = null;
    isPacked: boolean = false;
    finish: boolean = false;
    bufferType: BufferType = BufferType.FrameBuffer;
    uniform: OpUniform| null = null;

    constructor(op: ModelOp, idx: number) {
        const {
            inputs,
            outputs,
            attrs = {},
            type,
            isPacked = false,
            bufferType = BufferType.FrameBuffer,
            uniform = null
        } = op;

        this.id = `${type}_${+new Date()}_${idx}`;
        this.inputs = inputs;
        this.outputs = outputs;
        this.attrs = attrs;
        this.subAttrs = op['sub-attrs'] || [];
        this.uniform = uniform;
        this.type = type;
        this.isPacked = isPacked;
        this.bufferType = bufferType;
        this.finish = false;
        this.next = '';
        this.opData = null;
    }

    get inputsName() {
        const inputsName = [];
        Object.keys(this.inputs).forEach(inputKey => {
            inputsName.push(this.inputs[inputKey][0]);
        });
        return inputsName;
    }

    get outputsName() {
        // not all outputs are useful
        return this.outputs.Output || this.outputs.Out || this.outputs.Y;
    }

    /**
     * 将输入数据和具体op进行关联，触发执行具体每一个op
     * @param opData op data
     * @param isRendered
     */
    execute(isRendered) {
        GLOBALS.backendInstance.runProgram(this.opData, isRendered);
    }
}
