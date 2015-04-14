<?php 
include('./lib/connectdb.php');
include('./lib/jsonencode.php5');


$something = $_GET['s'];
$fonction = $_GET['callback'];



$seta = mysql_query("Set @rank = 0;");
$setb = mysql_query("Set @prank = 0;");

$result = mysql_query("
Select cc.*, pc.pre_rank - cc.cur_rank as 'delta' 
from
(Select @rank:=@rank+1 as cur_rank,j.jou_id, jou_nom, jou_prenom, jou_actif, jou_photo, jou_position, count(ej.ev_id) as 'points' 
from FG_joueurs j
LEFT OUTER JOIN (
FG_ev_jou ej
INNER JOIN (
FG_evenements e
) ON ( ej.ev_id = e.ev_id )
) ON ( j.jou_id = ej.jou_id ) 
Where  
 ev_date <= '2015-01-31' or ev_date is null
group by j.jou_id, jou_nom, jou_prenom, jou_actif, jou_photo, jou_position 
order by points desc, j.jou_id
) cc,
(
Select @prank:=@prank+1 as pre_rank,j.jou_id, jou_nom, jou_prenom, jou_actif, jou_photo, jou_position, count(ej.ev_id) as 'points' 
from FG_joueurs j
LEFT OUTER JOIN (
FG_ev_jou ej
INNER JOIN (
FG_evenements e
) ON ( ej.ev_id = e.ev_id )
) ON ( j.jou_id = ej.jou_id ) 
Where  
ev_date <= '2015-01-24' or ev_date is null
group by j.jou_id, jou_nom, jou_prenom, jou_actif, jou_photo, jou_position 
order by points desc, j.jou_id
) pc
where 
cc.jou_id = pc.jou_id
order by cc.cur_rank , pc.pre_rank desc
");



/*
Select @rank:=@rank+1 as cur_rank,j.jou_id, jou_nom, jou_prenom, jou_actif, jou_photo, jou_position, 1 as points, 0 as delta 
from FG_joueurs j
");
*/


/*

*/


$jsonObj= array();

//retrieve every record and put it into an array that we can later turn into JSON
while($r = mysql_fetch_assoc($result)){
    $jsonObj[]['data'] = $r;
}
//echo result as json

$final_res =json_encode($jsonObj) ;
header('Cache-Control: no-cache, must-revalidate');
header('Expires: Mon, 26 Jul 1997 05:00:00 GMT');
header('Content-type: application/json; Charset=UTF-8');


if($fonction != "") 
{
	//$final_res = substr($final_res,1);
    //$final_res = substr($final_res,0,-1);
	$final_res =  $fonction . '(' . $final_res . ");";
}

echo $final_res;

?>