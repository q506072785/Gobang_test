
var chessBoard = [];                /*用来存储棋盘上已经存在的棋子*/
var me = true;                      /*下一步落子是否是黑子*/
var over = false;                   /*游戏是否结束*/

//赢法数组
var wins=[];
//赢法统计数组 两方
var myWin =[];
var computerWin = [];

for(var i = 0;i<15;i++){
    chessBoard[i]=[];
    for(var j=0;j<15;j++){
        chessBoard[i][j]=0;             //0代表没有落子
    }
}
for(var i=0;i<15;i++){
    wins[i] = [];
    for(var j=0;j<15;j++){
        wins[i][j] = [];
    }
}
//赢法的索引 count
var count = 0;
//横线五个子的赢法
for(var i=0;i<15;i++){
    for(var j=0;j<11;j++){
        //wins[0][0][0] = true;
        //wins[0][1][0] = true;
        //wins[0][2][0] = true;
        //wins[0][3][0] = true;
        //wins[0][4][0] = true;

        //wins[0][0][1] = true;
        //wins[0][1][1] = true;
        //wins[0][2][1] = true;
        //wins[0][3][1] = true;
        //wins[0][4][1] = true;
        for(var k=0;k<5;k++){
            wins[i][j+k][count] = true;
        }
        count++;
    }
}
//竖线的赢法
for(var i=0;i<15;i++){
    for(var j=0;j<11;j++){
        for(var k=0;k<5;k++){
            wins[j+k][i][count] = true;
        }
        count++;
    }
}
// 正斜线的赢法
for(var i=0;i<11;i++){
    for(var j=14;j>3;j--){
        for(var k=0;k<5;k++){
            wins[i+k][j-k][count] = true;
        }
        count++;
    }
}
//反斜线的赢法
for(var i=0;i<11;i++){
    for(var j=0;j<11;j++){
        for(var k=0;k<5;k++){
            wins[i+k][j+k][count] = true;
        }
        count++;
    }
}
console.log(count);

//初始化赢法统计
for(var i=0;i<count;i++){
    myWin[i] = 0;
    computerWin[i] = 0;
}

var chess = document.getElementById('chess');
var ctx = chess.getContext('2d');
ctx.strokeStyle = '#efefef';
window.onload = function(){
    console.log(1);
    drawBoard();
}
/*绘出棋盘*/
var drawBoard = function(){
    for(var i=0;i<15;i++) {
        ctx.moveTo(15 + i * 30, 15);
        ctx.lineTo(15 + i * 30, 435);
        ctx.stroke();
        ctx.moveTo(15, 15 + i * 30);
        ctx.lineTo(435, 15 + i * 30);
        ctx.stroke();
    }
}

/*落子*/
var oneStep = function(i,j,me){
    ctx.beginPath();
    ctx.arc(15+i*30,15+j*30,13,0,2*Math.PI);
    ctx.closePath();
    var g = ctx.createRadialGradient(15+i*30+2,15+j*30-2,13,15+i*30+2,15+j*30-2,1);
    if(me){
        g.addColorStop(0,"#0a0a0a");
        g.addColorStop(1,"#636766");
    }else{
        g.addColorStop(0,"#d1d1d1");
        g.addColorStop(1,"#f9f9f9");
    }
    ctx.fillStyle = g;
    ctx.fill();
}
/*点击棋盘监听函数*/
chess.onclick = function(e){
    if(over){return;}
    if(!me){return;}
    var x = e.offsetX;
    var y = e.offsetY;
    var i = Math.floor(x/30);
    var j = Math.floor(y/30);
    if(chessBoard[i][j] == 0){
        oneStep(i,j,me);
        chessBoard[i][j]=1;
        for(var k=0;k<count;k++){
            if(wins[i][j][k]){              //第K种赢法
                myWin[k]++;                 //加入在[i][j]位置已经落黑子，白子不可能再落子
                computerWin[k] = 6;         //赢法给个异常值
                if(myWin[k] == 5){
                    window.alert("你赢了！！");
                    over = true;            //棋局结束
                }
            }
        }
        if(!over){
            me = !me;
            computerAI();
        }
    }
}
var computerAI = function(){
    var myScore = [];                   //记录我放得分
    var computerScore = [];             //记录电脑得分
    var max =  0;                       //保存最高分数
    var u=0,v=0;                        //保存最高分数点的坐标
    for(var i=0;i<15;i++){              //初始化
        myScore[i] = [];
        computerScore[i] = [];
        for(var j=0;j<15;j++){
            myScore[i][j] = 0;
            computerScore[i][j] = 0;
        }
    }
    //遍历所有赢法
    for(var i=0;i<15;i++){
        for(var j=0;j<15;j++){
            if(chessBoard[i][j] == 0){
                for(var k=0;k<count;k++){
                    if(wins[i][j][k]){  //计算机来拦截的比重
                        if(myWin[k] == 1){
                            myScore[i][j] +=200;
                        }else if(myWin[k] ==2){
                            myScore[i][j] +=400;
                        }else if(myWin[k] ==3){
                            myScore[i][j] +=2000;
                        }else if(myWin[k] ==4){
                            myScore[i][j] +=10000;
                        }
                        if(computerWin[k] == 1){
                            computerScore[i][j] +=220;
                        }else if(computerWin[k] ==2){
                            computerScore[i][j] +=420;
                        }else if(computerWin[k] ==3){
                            computerScore[i][j] +=2200;
                        }else if(computerWin[k] ==4){
                            computerScore[i][j] +=20000;
                        }
                    }
                }
                if(myScore[i][j]>max){
                    max= myScore[i][j];
                    u = i;
                    v = j;
                }else if(myScore[i][j] == max){
                    if(computerScore[i][j] > computerScore[u][v]){
                        u = i;
                        v = j;
                    }
                }
                if(computerScore[i][j]>max){
                    max= computerScore[i][j];
                    u = i;
                    v = j;
                }else if(computerScore[i][j] == max){
                    if(myScore[i][j] > myScore[u][v]){
                        u = i;
                        v = j;
                    }
                }
            }
        }
    }
    oneStep(u,v,false);
    chessBoard[u][v] = 2;               //计算机落子
    for(var k=0;k<count;k++){
        if(wins[u][v][k]){              //第K种赢法
            computerWin[k]++;                 //加入在[i][j]位置已经落黑子，白子不可能再落子
            myWin[k] = 6;         //赢法给个异常值
            if(computerWin[k] == 5){
                window.alert("电脑胜利！！");
                over = true;            //棋局结束
            }
        }
    }
    if(!over){
        me = !me;
    }
}



