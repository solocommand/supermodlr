<ul>
<?php
		foreach ($models as $model)
		{
			?>
				<li><a href="/supermodlrui/<?php echo $model['model_name']; ?>"><?= $model['model_name']; ?></a></li>
	<?php
		}
	?>
</ul>