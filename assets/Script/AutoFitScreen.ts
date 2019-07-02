
const {ccclass, property} = cc._decorator;

@ccclass
export default class AutoFitScreen extends cc.Component {

    // @property(cc.Label)
    // label: cc.Label = null;


    public static designWidth=1280;
    public static designHeight=1920;

    public static initBigbackWidth=2000;
    
    // private initWidth:number=0;
    // private initHeight:number=0;

    // private initFrameWidth:number=0;
    // private initFrameHeight:number=0;

    onLoad () {

        // this.initWidth=this.node.width;
        // this.initHeight=this.node.height;

        // let fsize_t:cc.Size=cc.view.getFrameSize();
        // this.initFrameWidth=(fsize_t.width>fsize_t.height)?fsize_t.height:fsize_t.width;
        // this.initFrameHeight=(fsize_t.width>fsize_t.height)?fsize_t.width:fsize_t.height;

        // this.showViewSizeInfo();
     
        {
            let vi_t:any=cc.view;
            vi_t.on('canvas-resize',()=>{
                // cc.view.emit('canvas-resize');
                // console.log("resizeresizeresizeresize-resizecanvas-resize");
                this.changeViewSize();
            });
        }
    }
    
    start () {
        this.changeViewSize();
    }
    private showViewSizeInfo()
    {
        console.log("resize:  "+Date.now()+" ("+cc.Canvas.instance.node.width.toFixed(0)+","+cc.Canvas.instance.node.height.toFixed(0)+")"
                    +" ("+cc.winSize.width.toFixed(0)+","+cc.winSize.height.toFixed(0)+")"
                    +" ("+this.node.width.toFixed(0)+","+this.node.height.toFixed(0)+")"
                    // +" ("+this.initWidth.toFixed(0)+","+this.initHeight.toFixed(0)+")"
                    // +" ("+this.initFrameWidth.toFixed(0)+","+this.initFrameHeight.toFixed(0)+")"
                    +" "+cc.view.getCanvasSize().toString()+" "
                    +" "+cc.view.getFrameSize().toString()+" "
                    +" "+cc.view.getVisibleSize().toString()+" "
                    +" "+cc.view.getVisibleSizeInPixel().toString());
    }
    private changeViewSize()
    {

        this.showViewSizeInfo();
        let curCanvasWidth_t=cc.winSize.width;        
        let curCanvasHeight_t=cc.winSize.height;

        let fsize_t:cc.Size=cc.view.getFrameSize();

        let ss_t=AutoFitScreen.designWidth/fsize_t.width;

        this.changeCurViewSize(curCanvasWidth_t,curCanvasHeight_t,ss_t);        
    }
    private changeCurViewSize(width_:number,height_:number,scl_:number)
    {

        console.log("changeCurViewSize: ",width_,height_,scl_);
        let curCanvasWidth_t=width_;        
        let curCanvasHeight_t=height_; 

            this.node.setContentSize(curCanvasWidth_t,curCanvasHeight_t);
            for(let a=0;a<this.node.childrenCount;a++)
            {
                let child_t=this.node.children[a];
                if(child_t.active){
                    this.resetChildSize(child_t,scl_);                    
                }
            }
        
    }

    private resetChildSize(childNode_:cc.Node,scl_:number)
    {
        if(childNode_)
        {
            let widget_t1:cc.Widget=childNode_.getComponent(cc.Widget);
            if(widget_t1){
                widget_t1.updateAlignment();//自动对齐 有Bug,按说明会自动调用，实际上有些运行环境没执行，所有手动执行
            }
            
            let scr_t:cc.ScrollView=childNode_.getComponent(cc.ScrollView);
            if(scr_t){
                childNode_.getChildByName("scrollBar").getComponent(cc.Widget).updateAlignment();
                childNode_.getChildByName("view").getComponent(cc.Widget).updateAlignment();
                scr_t.content.width=AutoFitScreen.designWidth;
                scr_t.content.height=AutoFitScreen.designHeight*scl_;
                scr_t.content.children[0].scale=scl_;//主体内容全在这个节点

                //浮动UI               
                let driftui_t=childNode_.getChildByName("driftuis");
                driftui_t.getComponent(cc.Widget).updateAlignment();
                for(let a=0;a<driftui_t.childrenCount;a++)
                {
                    let child_t=driftui_t.children[a];
                    if(child_t){
                        child_t.getComponent(cc.Widget).updateAlignment();
                        child_t.scale=scl_;
                    }
                }               
            }

            //纯色背景
            let nodeName_t=childNode_.name;
            if(nodeName_t=="colorback"){
                childNode_.scale=scl_;                
            }

        }
    }


    // update (dt) {}
}
