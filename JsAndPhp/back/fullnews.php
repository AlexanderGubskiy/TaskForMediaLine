<?php
include_once("phpQuery-onefile.php");

$url=$_POST["href"];
$file=file_get_contents($url);
$doc=phpQuery::newDocument($file);
$info=$doc->find('.article__text')->html();
echo ($info);

?>