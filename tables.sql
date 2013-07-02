
CREATE TABLE IF NOT EXISTS `bookmark` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `entry_id` int(11) NOT NULL COMMENT 'ブックマークをつけたエントリのID',
  `user_id` int(11) NOT NULL COMMENT 'ブックマークしたユーザーのID',
  `comment` varchar(255) NOT NULL COMMENT 'ユーザーのつけたコメント',
  `register_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '登録日時',
  `update_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '更新日時',
  PRIMARY KEY (`id`),
  UNIQUE KEY `entry_user` (`entry_id`,`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='フィードの1ブックマーク' AUTO_INCREMENT=1 ;

CREATE TABLE IF NOT EXISTS `feed` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL COMMENT 'フィードのタイトル',
  `url` varchar(255) NOT NULL COMMENT 'フィードのURL',
  `register_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '登録日時',
  `update_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '更新日時',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`url`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='フィード' AUTO_INCREMENT=8 ;

INSERT INTO `feed` (`id`, `title`, `url`, `register_time`, `update_time`) VALUES
(1, 'はてなブックマーク新着エントリ', 'http://b.hatena.ne.jp/entrylist?sort=hot&threshold=3&mode=rss', '2013-06-30 16:56:00', '0000-00-00 00:00:00'),
(7, 'マナドット', 'http://manaten.net/feed', '2013-06-30 16:56:00', '0000-00-00 00:00:00');

CREATE TABLE IF NOT EXISTS `feed_entry` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `feed_id` int(11) NOT NULL COMMENT 'エントリの属するフィードのID',
  `entry_token` varchar(255) NOT NULL COMMENT 'エントリから計算されるユニークトークン',
  `title` varchar(255) NOT NULL COMMENT 'エントリのタイトル',
  `url` varchar(255) NOT NULL COMMENT 'エントリのURL',
  `content` text NOT NULL COMMENT 'エントリの内容',
  `post_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT 'エントリの投稿日時',
  `register_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '登録日時',
  `update_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '更新日時',
  PRIMARY KEY (`id`),
  UNIQUE KEY `feed_entry` (`feed_id`,`entry_token`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='フィードの1エントリ' AUTO_INCREMENT=375 ;

CREATE TABLE IF NOT EXISTS `saved_queries` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL COMMENT 'ユーザーのID',
  `queries` text NOT NULL COMMENT 'ユーザーのつけたフィード。JSON配列形式。',
  `register_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '登録日時',
  `update_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '更新日時',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user` (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='ユーザーの保存したフィルターリスト' AUTO_INCREMENT=2 ;

INSERT INTO `saved_queries` (`id`, `user_id`, `queries`, `register_time`, `update_time`) VALUES
(1, 1, '[]', '2013-07-01 08:19:53', '0000-00-00 00:00:00');


CREATE TABLE IF NOT EXISTS `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL COMMENT '運営中のブログ名',
  `password` varchar(255) NOT NULL COMMENT 'sha1でハッシュされたパスワード',
  `register_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '登録日時',
  `update_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' COMMENT '更新日時',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='ログインユーザー' AUTO_INCREMENT=9 ;

INSERT INTO `user` (`id`, `name`, `password`, `register_time`, `update_time`) VALUES
(1, 'manaten', '', '2013-06-30 16:02:03', '0000-00-00 00:00:00');
