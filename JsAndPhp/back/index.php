<?php

header('Content-type: text/html; charset=utf-8');
include_once("phpQuery-onefile.php");
require_once 'connection.php';
$link = mysqli_connect($host, $user, $password, $database) 
    or die("Ошибка " . mysqli_error($link));
mysqli_query($link,"truncate table news"); 
$url='https://www.rbc.ru/';
$file=file_get_contents($url);
$doc=phpQuery::newDocument($file);//( js-news-feed-list
echo "<br>";

for($i=0;$i<14;$i++){
    $data=$doc->find('.news-feed__item.js-news-feed-item.js-yandex-counter:eq('.$i.')');   //('.js-news-feed-list')->html();   
    $name=$data->find('.news-feed__item__title')->text();
    $href=$data->attr("href");
    $date=$data->find('.news-feed__item__date-text')->text();
    $date=substr($date,-5);

    $fileNews=file_get_contents($href);
    $docNews=phpQuery::newDocument($fileNews);
    $dataTitle=$docNews->find('.article__text__overview')->text();
    $dataNews=$docNews->find('.article__text p:eq(1)')->text();
    $query="INSERT INTO news (name,href,date,info) VALUES('$name','$href','$date','$dataNews')";
    mysqli_query($link, $query) or die("Ошибка " . mysqli_error($link));
    echo ($name." ".$date." ".$href."<br>".$dataNews);
    echo ("<form action='fullnews.php' method='post'>
    <input type='hidden' name='href' value='$href'>      
    <input type='submit' value='Подробнее'>
    </form><hr>");
}



//15 новостей собрать не получилось, т.к. на статически на странице расположены только 14. Ниже приведен вариант выгрузки с помощью GET запроса
//Выгрузка данных из GET запроса, который возвращается новости в формате JSON.
/* 
$jsonurl = "https://www.rbc.ru/v10/ajax/get-news-feed/project/rbcnews/modifDate/1570615622/";
$json = file_get_contents($jsonurl);
$data=json_decode($json,true);
$data=$data['inserted'][1]['html'];

$doc = phpQuery::newDocument($data);
$title=$doc->find('.news-feed__item__title')->text();
$date=$doc->find('.news-feed__item__date-text')->text();
$date=substr($date,-5);
$href=$doc->find('a')->attr('href');

$fileNews=file_get_contents($href);
$docNews=phpQuery::newDocument($fileNews);
$dataTitle=$docNews->find('.article__text__overview')->text();
$dataNews=$docNews->find('.article__text p:eq(1)')->text();
$query="INSERT INTO news (name,href,date,info) VALUES('$title','$href','$date','$dataNews')";
mysqli_query($link, $query) or die("Ошибка " . mysqli_error($link));
echo ($title." ".$date."<br>".$dataNews);
echo ("<form action='fullnews.php' method='post'>
<input type='hidden' name='href' value='$href'>      
<input type='submit' value='Подробнее'>
</form><hr>");
*/
mysqli_close($link);
?>